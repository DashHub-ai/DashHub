import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import {
  type ChatsSdk,
  SdkCreateChatInputV,
  SdKSearchChatsInputV,
} from '@llm/sdk';
import { ChatsService } from '~/modules/chats';
import { ConfigService } from '~/modules/config';

import {
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
      .post(
        '/',
        sdkSchemaValidator('json', SdkCreateChatInputV),
        async context => pipe(
          context.req.valid('json'),
          chatsService.asUser(context.var.jwt).create,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<ChatsSdk['create']>>(context),
        ),
      );
  }
}
