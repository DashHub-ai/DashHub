import { apply, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { delay, inject, injectable } from 'tsyringe';

import { findItemIndexById, rejectFalsyItems, tapTaskEitherErrorTE, tryOrThrowTE } from '@llm/commons';
import {
  groupSdkAIMessagesByRepeats,
  type SdkCreateMessageInputT,
  type SdkJwtTokenT,
  type SdkRequestAIReplyInputT,
  type SdkSearchMessageItemT,
} from '@llm/sdk';
import {
  createAIAttachedFilesTag,
  createAIExternalApiAsyncFunctions,
  createAIQuoteTag,
  createAttachAppSystemMessage,
  createContextPrompt,
  wrapUserPromptWithAiTags,
} from '~/modules/prompts';

import type { AIProxyAsyncFunction, AIProxyAsyncFunctionResult, AIProxyStreamChunk } from '../ai-connector/clients';
import type { ExtractedFile } from '../api/helpers';
import type { TableId, TableRowWithId, TableRowWithUuid, TableUuid } from '../database';

import { AIConnectorService } from '../ai-connector';
import { AIExternalAPIsService } from '../ai-external-apis';
import { AppsService } from '../apps';
import { WithAuthFirewall } from '../auth';
import { ChatsService } from '../chats';
import { LoggerService } from '../logger';
import { OrganizationsAISettingsRepo } from '../organizations-ai-settings';
import { PermissionsService } from '../permissions';
import { ProjectsService } from '../projects';
import { ProjectsEmbeddingsService } from '../projects-embeddings';
import { ProjectsFilesService } from '../projects-files';
import { SearchEngineResultItem } from '../search-engines/clients/search-engine-proxy';
import { UsersAISettingsRepo } from '../users-ai-settings';
import { MessagesEsIndexRepo, MessagesEsSearchRepo } from './elasticsearch';
import { MessagesFirewall } from './messages.firewall';
import { MessagesRepo } from './messages.repo';
import { MessageInsertTableRow } from './messages.tables';

export type CreateUserMessageInputT = {
  chat: TableRowWithUuid;
  message: Omit<SdkCreateMessageInputT, 'files'>;
  creator: TableRowWithId;
  files?: ExtractedFile[];
};

export type AttachAppInputT = {
  chat: TableRowWithUuid;
  app: TableRowWithId;
  creator: TableRowWithId;
};

@injectable()
export class MessagesService implements WithAuthFirewall<MessagesFirewall> {
  private readonly logger = LoggerService.of('MessagesService');

  constructor(
    @inject(MessagesRepo) private readonly repo: MessagesRepo,
    @inject(MessagesEsSearchRepo) private readonly esSearchRepo: MessagesEsSearchRepo,
    @inject(MessagesEsIndexRepo) private readonly esIndexRepo: MessagesEsIndexRepo,
    @inject(AIConnectorService) private readonly aiConnectorService: AIConnectorService,
    @inject(ProjectsEmbeddingsService) private readonly projectsEmbeddingsService: ProjectsEmbeddingsService,
    @inject(ProjectsFilesService) private readonly projectsFilesService: ProjectsFilesService,
    @inject(ProjectsService) private readonly projectsService: ProjectsService,
    @inject(UsersAISettingsRepo) private readonly usersAISettings: UsersAISettingsRepo,
    @inject(OrganizationsAISettingsRepo) private readonly organizationsAISettings: OrganizationsAISettingsRepo,
    @inject(delay(() => PermissionsService)) private readonly permissionsService: Readonly<PermissionsService>,
    @inject(delay(() => ChatsService)) private readonly chatsService: Readonly<ChatsService>,
    @inject(delay(() => AppsService)) private readonly appsService: Readonly<AppsService>,
    @inject(delay(() => AIExternalAPIsService)) private readonly aiExternalAPIsService: Readonly<AIExternalAPIsService>,
  ) {}

  asUser = (jwt: SdkJwtTokenT) => new MessagesFirewall(
    jwt,
    this,
    this.chatsService,
    this.permissionsService,
    this.aiExternalAPIsService,
  );

  get = this.esSearchRepo.get;

  search = this.esSearchRepo.search;

  searchByChatId = this.esSearchRepo.searchByChatId;

  createUserMessage = ({ creator, chat, message, files }: CreateUserMessageInputT) => pipe(
    this.repo.create({
      value: {
        chatId: chat.id,
        content: message.content,
        webSearch: !!message.webSearch,
        metadata: {},
        aiModelId: null,
        creatorUserId: creator.id,
        repliedMessageId: message.replyToMessageId ?? null,
        role: 'user',
        corrupted: false,
      },
    }),
    TE.tap(({ id }) => {
      if (!files || files.length === 0) {
        return TE.of(undefined);
      }

      return pipe(
        this.projectsService.ensureChatHasProjectOrCreateInternal({ creator, chat }),
        TE.chainW(project => pipe(
          files,
          TE.traverseArray(file => this.projectsFilesService.uploadFile({
            projectId: project.id,
            messageId: id,
            ...file,
          })),
        )),
      );
    }),
    TE.tap(({ id }) => this.indexMessageAndSyncChat(chat.id, id)),
  );

  attachApp = ({ chat, app, creator }: AttachAppInputT) =>
    pipe(
      this.appsService.get(app.id),
      TE.chainW(app => this.createAndIndexMessage({
        chatId: chat.id,
        appId: app.id,
        content: createAttachAppSystemMessage(app),
        metadata: {},
        aiModelId: app.aiModel?.id ?? null,
        creatorUserId: creator.id,
        role: 'system',
        corrupted: false,
        webSearch: false,
      })),
    );

  aiReply = (
    {
      id,
      aiModel,
      asyncFunctions,
      preferredLanguageCode,
    }: TableRowWithUuid & SdkRequestAIReplyInputT & {
      asyncFunctions?: AIProxyAsyncFunction[];
    },
    signal?: AbortSignal,
  ) => pipe(
    TE.Do,
    TE.bind('message', () => this.get(id)),
    TE.bind('chat', ({ message }) => this.chatsService.get(message.chat.id)),
    TE.bindW('appsAsyncFunctions', ({ chat }) => {
      const externalAPIsIds = chat.apps.map(app => app.aiExternalAPI?.id).filter(Boolean) as TableId[];

      if (externalAPIsIds.length === 0) {
        return TE.of([]);
      }

      return pipe(
        this.aiExternalAPIsService.search({
          ids: externalAPIsIds,
          offset: 0,
          limit: externalAPIsIds.length,
          archived: false,
          internal: true,
        }),
        TE.map(({ items }) => items.flatMap(createAIExternalApiAsyncFunctions)),
      );
    }),
    TE.bindW('personalities', ({ message, chat }) => apply.sequenceS(TE.ApplicativePar)({
      user: (() => {
        if (!message.creator) {
          return TE.of(null);
        }

        return this.usersAISettings.getChatContextByUserIdOrNil({
          userId: message.creator.id,
        });
      })(),

      organization: this.organizationsAISettings.getChatContextByOrganizationIdOrNil({
        organizationId: chat.organization.id,
      }),
    })),
    TE.bindW('history', ({ message }) => pipe(
      this.searchByChatId(message.chat.id),
      TE.map(({ items }) => pipe(
        items,
        rejectCorruptedMessages,
        filterConsecutiveUserMessages,
      )),
      TE.map((items) => {
        const historyIndex = findItemIndexById(message.id)(items);

        return pipe(
          items.slice(historyIndex + 1).toReversed(),
          groupSdkAIMessagesByRepeats,
        );
      }),
    )),
    TE.bindW('mappedContent', ({ message, chat, history }) => pipe(
      TE.Do,
      TE.bind('embeddings', () => this.projectsEmbeddingsService.createEmbeddingsAITag({
        chat,
        history,
        message: rejectFalsyItems(
          [
            message.content,
            message.repliedMessage?.content,
          ],
        ).join('\n'),
      })),
      TE.bind('reply', () => TE.of(createAIQuoteTag(message.repliedMessage))),
      TE.bind('attachedFiles', () => TE.of(createAIAttachedFilesTag(message.files))),
      TE.map(({ reply, attachedFiles, embeddings }) =>
        wrapUserPromptWithAiTags({
          preferredLanguageCode,
          userPrompt: message.content,
          children: [
            reply,
            attachedFiles,
            embeddings,
          ],
        }),
      ),
    )),
    TE.chainW(({ mappedContent, history, message, chat, personalities, appsAsyncFunctions }) =>
      pipe(
        this.aiConnectorService.executeStreamPrompt(
          {
            signal,
            aiModel,
            history,
            asyncFunctions: [
              ...appsAsyncFunctions ?? [],
              ...asyncFunctions ?? [],
            ],
            organization: chat.organization,
            context: createContextPrompt({
              personalities,
            }),
            message: {
              content: mappedContent,
              webSearch: message.webSearch.enabled,
            },
          },
        ),
        tapTaskEitherErrorTE(() => this.createAndIndexMessage({
          chatId: message.chat.id,
          content: 'Cannot establish connection with my AI model.',
          metadata: {},
          aiModelId: aiModel.id,
          repliedMessageId: message.id,
          creatorUserId: null,
          role: 'assistant',
          corrupted: true,
          webSearch: message.webSearch.enabled,
        })),
        TE.map(stream => this.createAIResponseMessage(
          {
            repliedMessageId: message.id,
            chatId: message.chat.id,
            aiModelId: aiModel.id,
            webSearch: message.webSearch.enabled,
            stream,
          },
          signal,
        )),
      ),
    ),
  );

  private async *createAIResponseMessage(
    {
      chatId,
      aiModelId,
      stream,
      repliedMessageId,
      webSearch,
    }: {
      repliedMessageId: TableUuid;
      chatId: TableUuid;
      aiModelId: TableId;
      stream: AsyncIterableIterator<AIProxyStreamChunk>;
      webSearch: boolean;
    },
    signal?: AbortSignal,
  ) {
    let content = '';
    let corrupted = false;

    let webSearchResults: SearchEngineResultItem[] | null = null;
    let asyncFunctionsResults: AIProxyAsyncFunctionResult[] | null = null;

    try {
      for await (const item of stream) {
        if (signal?.aborted) {
          return;
        }

        if (typeof item === 'string') {
          content += item;
          yield item;
        }

        if (typeof item === 'object') {
          if (item.webSearchResults) {
            webSearchResults = item.webSearchResults;
          }

          if (item.asyncFunctionsResults) {
            asyncFunctionsResults = item.asyncFunctionsResults;
          }
        }
      }

      if (!signal?.aborted) {
        yield '';
      }
    }
    catch (error) {
      if (!signal?.aborted) {
        this.logger.error('AI response generation error!', error);

        corrupted = true;
      }
    }

    const filteredWebSearchResults = (webSearchResults || []).filter(
      ({ url, title }) => content.includes(url) || content.includes(title),
    );

    await pipe(
      this.createAndIndexMessage({
        chatId,
        aiModelId,
        content,
        metadata: {
          ...asyncFunctionsResults && {
            asyncFunctionsResults,
          },
          ...webSearch && {
            webSearchResults: filteredWebSearchResults,
          },
        },
        repliedMessageId,
        creatorUserId: null,
        role: 'assistant',
        corrupted,
        webSearch,
      }),
      tryOrThrowTE,
    )();
  }

  private createAndIndexMessage = (dto: MessageInsertTableRow) => pipe(
    this.repo.create({ value: dto }),
    TE.tap(({ id }) => this.indexMessageAndSyncChat(dto.chatId, id)),
  );

  private indexMessageAndSyncChat = (chatId: TableUuid, messageId: TableUuid) => TE.sequenceArray([
    this.esIndexRepo.findAndIndexDocumentById(messageId),
    this.chatsService.findAndIndexDocumentById(chatId),
  ]);
}

function rejectCorruptedMessages(messages: SdkSearchMessageItemT[]): SdkSearchMessageItemT[] {
  return messages.filter(message => !message.corrupted);
}

function filterConsecutiveUserMessages(messages: SdkSearchMessageItemT[]): SdkSearchMessageItemT[] {
  return messages.reduce((acc, curr, i) => {
    if (curr.role !== 'user') {
      acc.push(curr);
      return acc;
    }

    // Find next non-user message
    const nextNonUserIndex = messages.findIndex((msg, idx) => idx > i && msg.role !== 'user');

    // If this is the last message in a sequence of user messages, keep it
    if (nextNonUserIndex === -1 && messages.slice(i + 1).every(msg => msg.role === 'user')) {
      acc.push(curr);
    }
    // If next message is not a user message, keep current one
    else if (i + 1 < messages.length && messages[i + 1].role !== 'user') {
      acc.push(curr);
    }

    return acc;
  }, [] as SdkSearchMessageItemT[]);
}
