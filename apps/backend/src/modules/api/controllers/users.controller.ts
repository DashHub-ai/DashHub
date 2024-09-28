import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import {
  SdkCreateUserInputV,
  type UsersSdk,
} from '@llm/sdk';
import { ConfigService } from '~/modules/config';
import { UsersService } from '~/modules/users';

import {
  mapDbRecordAlreadyExistsToSdkError,
  rejectUnsafeSdkErrors,
  sdkSchemaValidator,
  serializeSdkResponseTE,
} from '../helpers';
import { AuthorizedController } from './shared/authorized.controller';

@injectable()
export class UsersController extends AuthorizedController {
  constructor(
    @inject(ConfigService) configService: ConfigService,
    @inject(UsersService) usersService: UsersService,
  ) {
    super(configService);

    this.router
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
