import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import {
  SdkCreateUserInputV,
  SdKSearchUsersInputV,
  type UsersSdk,
} from '@llm/sdk';
import { ConfigService } from '~/modules/config';
import { UsersService } from '~/modules/users';

import {
  mapDbRecordAlreadyExistsToSdkError,
  rejectUnsafeSdkErrors,
  sdkSchemaValidator,
  serializeSdkResponseTE,
} from '../../helpers';
import { AuthorizedController } from '../shared/authorized.controller';

@injectable()
export class UsersController extends AuthorizedController {
  constructor(
    @inject(ConfigService) configService: ConfigService,
    @inject(UsersService) usersService: UsersService,
  ) {
    super(configService);

    this.router
      .get(
        '/search',
        sdkSchemaValidator('query', SdKSearchUsersInputV),
        async context => pipe(
          context.req.valid('query'),
          usersService.asUser(context.var.jwt).search,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<UsersSdk['search']>>(context),
        ),
      )
      .post(
        '/',
        sdkSchemaValidator('json', SdkCreateUserInputV),
        async context => pipe(
          usersService.asUser(context.var.jwt).create({
            value: context.req.valid('json'),
          }),
          mapDbRecordAlreadyExistsToSdkError,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<UsersSdk['create']>>(context),
        ),
      );
  }
}
