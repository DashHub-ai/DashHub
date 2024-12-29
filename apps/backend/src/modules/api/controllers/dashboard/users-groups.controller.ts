import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import {
  SdkCreateUsersGroupInputV,
  SdkSearchUsersGroupsInputV,
  SdkUpdateUsersGroupInputV,
  type UsersGroupsSdk,
} from '@llm/sdk';
import { ConfigService } from '~/modules/config';
import { UsersGroupsService } from '~/modules/users-groups';

import {
  mapDbRecordAlreadyExistsToSdkError,
  mapDbRecordNotFoundToSdkError,
  rejectUnsafeSdkErrors,
  sdkSchemaValidator,
  serializeSdkResponseTE,
} from '../../helpers';
import { AuthorizedController } from '../shared/authorized.controller';

@injectable()
export class UsersGroupsController extends AuthorizedController {
  constructor(
    @inject(ConfigService) configService: ConfigService,
    @inject(UsersGroupsService) groupsService: UsersGroupsService,
  ) {
    super(configService);

    this.router
      .get(
        '/search',
        sdkSchemaValidator('query', SdkSearchUsersGroupsInputV),
        async context => pipe(
          context.req.valid('query'),
          groupsService.asUser(context.var.jwt).search,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<UsersGroupsSdk['search']>>(context),
        ),
      )
      .patch(
        '/archive/:id',
        async context => pipe(
          Number(context.req.param().id),
          groupsService.asUser(context.var.jwt).archive,
          mapDbRecordNotFoundToSdkError,
          mapDbRecordAlreadyExistsToSdkError,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<UsersGroupsSdk['archive']>>(context),
        ),
      )
      .patch(
        '/unarchive/:id',
        async context => pipe(
          Number(context.req.param().id),
          groupsService.asUser(context.var.jwt).unarchive,
          mapDbRecordNotFoundToSdkError,
          mapDbRecordAlreadyExistsToSdkError,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<UsersGroupsSdk['unarchive']>>(context),
        ),
      )
      .post(
        '/',
        sdkSchemaValidator('json', SdkCreateUsersGroupInputV),
        async context => pipe(
          context.req.valid('json'),
          groupsService.asUser(context.var.jwt).create,
          mapDbRecordAlreadyExistsToSdkError,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<UsersGroupsSdk['create']>>(context),
        ),
      )
      .put(
        '/:id',
        sdkSchemaValidator('json', SdkUpdateUsersGroupInputV),
        async context => pipe(
          {
            id: Number(context.req.param().id),
            ...context.req.valid('json'),
          },
          groupsService.asUser(context.var.jwt).update,
          mapDbRecordAlreadyExistsToSdkError,
          mapDbRecordNotFoundToSdkError,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<UsersGroupsSdk['update']>>(context),
        ),
      );
  }
}
