import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { delay, inject, injectable } from 'tsyringe';

import { findItemIndexById, tryOrThrowTE } from '@llm/commons';
import {
  groupSdkAIMessagesByRepeats,
  type SdkCreateMessageInputT,
  type SdkJwtTokenT,
  type SdkRequestAIReplyInputT,
} from '@llm/sdk';
import {
  createAttachAppSystemMessage,
  createAttachedFilesMessagePrefix,
  createContextPrompt,
  createReplyAiMessagePrefix,
} from '~/modules/prompts';

import type { ExtractedFile } from '../api/helpers';
import type { TableId, TableRowWithId, TableRowWithUuid, TableUuid } from '../database';

import { AIConnectorService } from '../ai-connector';
import { AppsService } from '../apps';
import { WithAuthFirewall } from '../auth';
import { ChatsService } from '../chats';
import { PermissionsService } from '../permissions';
import { ProjectsService } from '../projects';
import { ProjectsEmbeddingsService } from '../projects-embeddings';
import { ProjectsFilesService } from '../projects-files';
import { MessagesEsIndexRepo, MessagesEsSearchRepo } from './elasticsearch';
import { MessagesFirewall } from './messages.firewall';
import { MessagesRepo } from './messages.repo';

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
  constructor(
    @inject(MessagesRepo) private readonly repo: MessagesRepo,
    @inject(MessagesEsSearchRepo) private readonly esSearchRepo: MessagesEsSearchRepo,
    @inject(MessagesEsIndexRepo) private readonly esIndexRepo: MessagesEsIndexRepo,
    @inject(AIConnectorService) private readonly aiConnectorService: AIConnectorService,
    @inject(ProjectsEmbeddingsService) private readonly projectsEmbeddingsService: ProjectsEmbeddingsService,
    @inject(ProjectsFilesService) private readonly projectsFilesService: ProjectsFilesService,
    @inject(ProjectsService) private readonly projectsService: ProjectsService,
    @inject(delay(() => PermissionsService)) private readonly permissionsService: Readonly<PermissionsService>,
    @inject(delay(() => ChatsService)) private readonly chatsService: Readonly<ChatsService>,
    @inject(delay(() => AppsService)) private readonly appsService: Readonly<AppsService>,
  ) {}

  asUser = (jwt: SdkJwtTokenT) => new MessagesFirewall(jwt, this, this.chatsService, this.permissionsService);

  get = this.esSearchRepo.get;

  search = this.esSearchRepo.search;

  searchByChatId = this.esSearchRepo.searchByChatId;

  createUserMessage = ({ creator, chat, message, files }: CreateUserMessageInputT) => pipe(
    this.repo.create({
      value: {
        chatId: chat.id,
        content: message.content,
        metadata: {},
        aiModelId: null,
        creatorUserId: creator.id,
        repliedMessageId: message.replyToMessageId ?? null,
        role: 'user',
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
    TE.tap(({ id }) => TE.sequenceArray([
      this.esIndexRepo.findAndIndexDocumentById(id),
      this.chatsService.findAndIndexDocumentById(chat.id),
    ])),
  );

  attachApp = ({ chat, app, creator }: AttachAppInputT) =>
    pipe(
      this.appsService.get(app.id),
      TE.chainW(app => this.repo.create({
        value: {
          chatId: chat.id,
          appId: app.id,
          content: createAttachAppSystemMessage(app),
          metadata: {},
          aiModelId: null,
          creatorUserId: creator.id,
          role: 'system',
        },
      })),
      TE.tap(({ id }) => this.esIndexRepo.findAndIndexDocumentById(id)),
    );

  aiReply = (
    { id, aiModel }: TableRowWithUuid & SdkRequestAIReplyInputT,
    signal?: AbortSignal,
  ) => pipe(
    TE.Do,
    TE.bind('message', () => this.get(id)),
    TE.bindW('history', ({ message }) => pipe(
      this.searchByChatId(message.chat.id),
      TE.map(({ items }) => {
        const historyIndex = findItemIndexById(message.id)(items);

        return pipe(
          items.slice(historyIndex + 1).toReversed(),
          groupSdkAIMessagesByRepeats,
        );
      }),
    )),
    TE.bindW('mappedContent', ({ message }) => pipe(
      message.repliedMessage
        ? createReplyAiMessagePrefix(message.repliedMessage, message.content)
        : message.content,

      createAttachedFilesMessagePrefix(message.files),

      prefixedMessage => this.projectsEmbeddingsService.wrapWithEmbeddingContextPrompt({
        message: prefixedMessage,
        chat: { id: message.chat.id },
      }),
    )),
    TE.chainW(({ mappedContent, history, message }) =>
      pipe(
        this.aiConnectorService.executeStreamPrompt(
          {
            signal,
            aiModel,
            history,
            context: createContextPrompt(),
            message: {
              content: mappedContent,
            },
          },
        ),
        TE.map(stream => this.createAIResponseMessage(
          {
            repliedMessageId: message.id,
            chatId: message.chat.id,
            aiModelId: aiModel.id,
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
    }: {
      repliedMessageId: TableUuid;
      chatId: TableUuid;
      aiModelId: TableId;
      stream: AsyncIterableIterator<string>;
    },
    signal?: AbortSignal,
  ) {
    let content = '';

    try {
      for await (const item of stream) {
        if (signal?.aborted) {
          return;
        }

        content += item;
        yield item;
      }

      await pipe(
        this.repo.create({
          value: {
            chatId,
            aiModelId,
            content,
            metadata: {},
            repliedMessageId,
            creatorUserId: null,
            role: 'assistant',
          },
        }),
        TE.tap(({ id }) => TE.sequenceArray([
          this.esIndexRepo.findAndIndexDocumentById(id),
          this.chatsService.findAndIndexDocumentById(chatId),
        ])),
        tryOrThrowTE,
      )();

      if (!signal?.aborted) {
        yield '';
      }
    }
    catch (error) {
      if (!signal?.aborted) {
        throw error;
      }
    }
  };
}
