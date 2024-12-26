import type { ChatCompletionChunk } from 'openai/resources/index.mjs';

import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { delay, inject, injectable } from 'tsyringe';

import { findItemIndexById, mapAsyncIterator, pluckTyped, tryOrThrowTE } from '@llm/commons';
import {
  groupSdkAIMessagesByRepeats,
  type SdkCreateMessageInputT,
  type SdkJwtTokenT,
  type SdkRequestAIReplyInputT,
} from '@llm/sdk';

import type { ExtractedFile } from '../api/helpers';
import type { TableId, TableRowWithId, TableRowWithUuid, TableUuid } from '../database';

import { AIConnectorService } from '../ai-connector';
import { AppsService } from '../apps';
import { WithAuthFirewall } from '../auth';
import { ProjectsService } from '../projects';
import { ProjectsEmbeddingsService } from '../projects-embeddings';
import { ProjectsFilesService } from '../projects-files';
import { MessagesEsIndexRepo, MessagesEsSearchRepo } from './elasticsearch';
import { createActionButtonsPrompt, createAttachAppAIMessage, createReplyAiMessagePrefix } from './helpers';
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
    @inject(delay(() => AppsService)) private readonly appsService: Readonly<AppsService>,
    @inject(MessagesEsSearchRepo) private readonly esSearchRepo: MessagesEsSearchRepo,
    @inject(MessagesEsIndexRepo) private readonly esIndexRepo: MessagesEsIndexRepo,
    @inject(AIConnectorService) private readonly aiConnectorService: AIConnectorService,
    @inject(ProjectsEmbeddingsService) private readonly projectsEmbeddingsService: ProjectsEmbeddingsService,
    @inject(ProjectsFilesService) private readonly projectsFilesService: ProjectsFilesService,
    @inject(ProjectsService) private readonly projectsService: ProjectsService,
  ) {}

  asUser = (jwt: SdkJwtTokenT) => new MessagesFirewall(jwt, this);

  search = this.esSearchRepo.search;

  searchByChatId = this.esSearchRepo.searchByChatId;

  createUserMessage = ({ creator, chat, message, files }: CreateUserMessageInputT) =>
    pipe(
      this.repo.create({
        value: {
          chatId: chat.id,
          content: message.content,
          metadata: {},
          aiModelId: null,
          creatorUserId: creator.id,
          repliedMessageId: message.replyToMessage?.id ?? null,
          role: 'user',
        },
      }),
      TE.tap(({ id }) => {
        if (!files || files.length === 0) {
          return TE.of(undefined);
        }

        return pipe(
          this.projectsService.ensureChatHasProjectOrCreateInternal(chat.id),
          TE.chainW(project => pipe(
            files,
            TE.traverseArray(file => this.projectsFilesService.uploadFile({
              projectId: project.id,
              messageId: id,
              ...file,
            })),
            TE.chainW(files => this.projectsFilesService.search({
              sort: 'createdAt:desc',
              limit: files.length,
              projectId: project.id,
              offset: 0,
              ids: pipe([...files], pluckTyped('id')),
            })),
          )),
          TE.chainW(attachedFiles => this.repo.create({
            value: {
              chatId: chat.id,
              metadata: {},
              aiModelId: null,
              creatorUserId: creator.id,
              role: 'system',
              content: [
                'User attached to chat these files:',
                ...attachedFiles.items.map(({ description, resource }) =>
                  `- ${resource.name} - ${description}`,
                ),
                '---',
                'If there is application attached to this chat, process these files with it.',
              ].join('\n'),
            },
          })),
        );
      }),
      TE.tap(({ id }) => this.esIndexRepo.findAndIndexDocumentById(id)),
    );

  attachApp = ({ chat, app, creator }: AttachAppInputT) =>
    pipe(
      this.appsService.get(app.id),
      TE.chainW(app => this.repo.create({
        value: {
          chatId: chat.id,
          appId: app.id,
          content: createAttachAppAIMessage(app),
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
    TE.bind('message', () => this.repo.findById({ id })),
    TE.bindW('replyContext', ({ message }) => {
      if (!message.repliedMessageId) {
        return TE.of(null);
      }

      return this.repo.findById({ id: message.repliedMessageId });
    }),
    TE.bindW('history', ({ message }) => pipe(
      this.searchByChatId(message.chatId),
      TE.map(({ items }) => {
        const historyIndex = findItemIndexById(message.id)(items);

        return pipe(
          items.slice(historyIndex + 1).toReversed(),
          groupSdkAIMessagesByRepeats,
        );
      }),
    )),
    TE.bindW('mappedContent', ({ replyContext, message }) => pipe(
      replyContext
        ? createReplyAiMessagePrefix(replyContext, message.content)
        : message.content,

      prefixedMessage => this.projectsEmbeddingsService.wrapWithEmbeddingContextPrompt({
        message: prefixedMessage,
        chat: { id: message.chatId },
      }),
    )),
    TE.chainW(({ mappedContent, history, message }) =>
      pipe(
        this.aiConnectorService.executeStreamPrompt(
          {
            signal,
            aiModel,
            history,
            context: createActionButtonsPrompt(),
            message: {
              content: mappedContent,
            },
          },
        ),
        TE.map(
          stream => pipe(
            stream as unknown as AsyncIterableIterator<ChatCompletionChunk>,
            mapAsyncIterator(chunk => chunk.choices[0]?.delta?.content ?? ''),
          ),
        ),
        TE.map(stream => this.createAIResponseMessage(
          {
            repliedMessageId: message.id,
            chatId: message.chatId,
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
        TE.tap(({ id }) => this.esIndexRepo.findAndIndexDocumentById(id)),
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
