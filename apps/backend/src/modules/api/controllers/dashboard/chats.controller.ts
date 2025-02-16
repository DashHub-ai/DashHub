import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { streamSSE } from 'hono/streaming';
import { inject, injectable } from 'tsyringe';

import { runTask } from '@llm/commons';
import {
  type ChatsSdk,
  SdkAttachAppInputV,
  SdkCreateChatInputV,
  SdkCreateMessageInputV,
  SdkRequestAIReplyInputV,
  SdkSearchChatsInputV,
  SdkSearchMessagesInputV,
  SdkUpdateChatInputV,
} from '@llm/sdk';
import { ChatsService } from '~/modules/chats';
import { ConfigService } from '~/modules/config';
import { MessagesService } from '~/modules/messages';

import {
  mapDbRecordAlreadyExistsToSdkError,
  mapDbRecordNotFoundToSdkError,
  rejectUnsafeSdkErrors,
  respondWithTaggedError,
  sdkSchemaValidator,
  serializeSdkResponseTE,
} from '../../helpers';
import { tryExtractFiles } from '../../helpers/try-extract-files';
import { AuthorizedController } from '../shared/authorized.controller';

@injectable()
export class ChatsController extends AuthorizedController {
  constructor(
    @inject(ConfigService) configService: ConfigService,
    @inject(ChatsService) chatsService: ChatsService,
    @inject(MessagesService) messagesService: MessagesService,
  ) {
    super(configService);

    this.router
      .get(
        '/search',
        sdkSchemaValidator('query', SdkSearchChatsInputV),
        async context => pipe(
          context.req.valid('query'),
          chatsService.asUser(context.var.jwt).search,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<ChatsSdk['search']>>(context),
        ),
      )
      .get(
        '/:id',
        async context => pipe(
          context.req.param('id'),
          chatsService.asUser(context.var.jwt).get,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<ChatsSdk['get']>>(context),
        ),
      )
      .post(
        '/',
        sdkSchemaValidator('json', SdkCreateChatInputV),
        async context => pipe(
          context.req.valid('json'),
          chatsService.asUser(context.var.jwt).create,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<ChatsSdk['create']>>(context),
        ),
      )
      .put(
        '/:id',
        sdkSchemaValidator('json', SdkUpdateChatInputV),
        async context => pipe(
          {
            id: context.req.param().id,
            ...context.req.valid('json'),
          },
          chatsService.asUser(context.var.jwt).update,
          mapDbRecordNotFoundToSdkError,
          mapDbRecordAlreadyExistsToSdkError,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<ChatsSdk['update']>>(context),
        ),
      )
      .patch(
        '/archive/:id',
        async context => pipe(
          context.req.param().id,
          chatsService.asUser(context.var.jwt).archive,
          mapDbRecordNotFoundToSdkError,
          mapDbRecordAlreadyExistsToSdkError,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<ChatsSdk['archive']>>(context),
        ),
      )
      .patch(
        '/unarchive/:id',
        async context => pipe(
          context.req.param().id,
          chatsService.asUser(context.var.jwt).unarchive,
          mapDbRecordNotFoundToSdkError,
          mapDbRecordAlreadyExistsToSdkError,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<ChatsSdk['unarchive']>>(context),
        ),
      )
      .get(
        '/:id/messages',
        sdkSchemaValidator('query', SdkSearchMessagesInputV),
        async context => pipe(
          messagesService.asUser(context.var.jwt).searchByChatId(
            context.req.param('id'),
            context.req.valid('query'),
          ),
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<ChatsSdk['searchMessages']>>(context),
        ),
      )
      .post(
        '/:id/messages',
        async context => pipe(
          await context.req.parseBody(),
          tryExtractFiles(
            SdkCreateMessageInputV.omit({
              files: true,
            }),
          ),
          TE.chainW(({ content, replyToMessageId, webSearch, files }) => messagesService.asUser(context.var.jwt).create({
            files: [...files ?? []],
            message: {
              content,
              replyToMessageId,
              webSearch,
            },
            chat: {
              id: context.req.param('id'),
            },
          })),
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<ChatsSdk['createMessage']>>(context),
        ),
      )
      .post(
        '/:id/messages/attach-app',
        sdkSchemaValidator('json', SdkAttachAppInputV),
        async context => pipe(
          context.req.valid('json'),
          payload => messagesService.asUser(context.var.jwt).attachApp({
            ...payload,
            chat: {
              id: context.req.param('id'),
            },
          }),
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<ChatsSdk['attachApp']>>(context),
        ),
      )
      .post(
        '/:id/messages/:messageId/ai-reply',
        sdkSchemaValidator('json', SdkRequestAIReplyInputV),
        async (context) => {
          const abortController = new AbortController();
          const streamAIResponse = (response: AsyncGenerator<string>) =>
            streamSSE(context, async (stream) => {
              stream.onAbort(() => {
                abortController.abort();
              });

              for await (const chunk of response) {
                await stream.write(chunk);
              }
            });

          return pipe(
            messagesService.asUser(context.var.jwt).aiReply(
              {
                ...context.req.valid('json'),
                id: context.req.param('messageId'),
              },
              abortController.signal,
            ),
            rejectUnsafeSdkErrors,
            TE.matchW(
              respondWithTaggedError(context),
              streamAIResponse,
            ),
            runTask,
          );
        },
      );
  }
}
