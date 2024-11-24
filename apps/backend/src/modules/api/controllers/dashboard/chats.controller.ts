import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import {
  type ChatsSdk,
  SdkCreateChatInputV,
  SdkCreateMessageInputV,
  SdKSearchChatsInputV,
  SdKSearchMessagesInputV,
} from '@llm/sdk';
import { ChatsService } from '~/modules/chats';
import { ConfigService } from '~/modules/config';
import { MessagesService } from '~/modules/messages';

import {
  mapDbRecordAlreadyExistsToSdkError,
  mapDbRecordNotFoundToSdkError,
  rejectUnsafeSdkErrors,
  sdkSchemaValidator,
  serializeSdkResponseTE,
} from '../../helpers';
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
        sdkSchemaValidator('query', SdKSearchChatsInputV),
        async context => pipe(
          context.req.valid('query'),
          chatsService.asUser(context.var.jwt).search,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<ChatsSdk['search']>>(context),
        ),
      )
      .get(
        '/:id',
        sdkSchemaValidator('query', SdKSearchChatsInputV),
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
        sdkSchemaValidator('query', SdKSearchMessagesInputV),
        async context => pipe(
          messagesService.asUser(context.var.jwt).search(
            {
              ...context.req.valid('query'),
              chatIds: [context.req.param('id')],
            },
          ),
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<ChatsSdk['searchMessages']>>(context),
        ),
      )
      .post(
        '/:id/messages',
        sdkSchemaValidator('json', SdkCreateMessageInputV),
        async context => pipe(
          context.req.valid('json'),
          message => messagesService.asUser(context.var.jwt).create({
            message,
            chat: {
              id: context.req.param('id'),
            },
          }),
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<ChatsSdk['createMessage']>>(context),
        ),
      );
  }
}
