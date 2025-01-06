import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import {
  SdkCreateUserInputV,
  SdkSearchUsersInputV,
  SdkUpdateUserInputV,
  type UsersSdk,
} from '@llm/sdk';
import { ConfigService } from '~/modules/config';
import { UsersService } from '~/modules/users';

import {
  mapDbRecordAlreadyExistsToSdkError,
  mapDbRecordNotFoundToSdkError,
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
        sdkSchemaValidator('query', SdkSearchUsersInputV),
        async context => pipe(
          context.req.valid('query'),
          usersService.asUser(context.var.jwt).search,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<UsersSdk['search']>>(context),
        ),
      )
      .patch(
        '/archive/:id',
        async context => pipe(
          Number(context.req.param().id),
          usersService.asUser(context.var.jwt).archive,
          mapDbRecordNotFoundToSdkError,
          mapDbRecordAlreadyExistsToSdkError,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<UsersSdk['archive']>>(context),
        ),
      )
      .patch(
        '/unarchive/:id',
        async context => pipe(
          Number(context.req.param().id),
          usersService.asUser(context.var.jwt).unarchive,
          mapDbRecordNotFoundToSdkError,
          mapDbRecordAlreadyExistsToSdkError,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<UsersSdk['unarchive']>>(context),
        ),
      )
      .post(
        '/',
        sdkSchemaValidator('json', SdkCreateUserInputV),
        async context => pipe(
          usersService.asUser(context.var.jwt).create(context.req.valid('json')),
          mapDbRecordAlreadyExistsToSdkError,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<UsersSdk['create']>>(context),
        ),
      )
      .put(
        '/:id',
        sdkSchemaValidator('json', SdkUpdateUserInputV),
        async context => pipe(
          {
            id: Number(context.req.param().id),
            ...context.req.valid('json'),
          },
          usersService.asUser(context.var.jwt).update,
          mapDbRecordAlreadyExistsToSdkError,
          mapDbRecordNotFoundToSdkError,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<UsersSdk['update']>>(context),
        ),
      );
  }
}
