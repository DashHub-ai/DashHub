import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import { SdkUpdateUserInputV, type UsersMeSdk } from '@llm/sdk';
import { ConfigService } from '~/modules/config';
import { UsersService } from '~/modules/users';

import {
  mapDbRecordAlreadyExistsToSdkError,
  mapDbRecordNotFoundToSdkError,
  mapEsDocumentNotFoundToSdkError,
  rejectUnsafeSdkErrors,
  sdkSchemaValidator,
  serializeSdkResponseTE,
} from '../../helpers';
import { AuthorizedController } from '../shared/authorized.controller';

@injectable()
export class UsersMeController extends AuthorizedController {
  constructor(
    @inject(ConfigService) configService: ConfigService,
    @inject(UsersService) usersService: UsersService,
  ) {
    super(configService);

    this.router
      .get(
        '/',
        async context => pipe(
          usersService.asUser(context.var.jwt).me.get(),
          mapEsDocumentNotFoundToSdkError,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<UsersMeSdk['get']>>(context),
        ),
      )
      .put(
        '/',
        sdkSchemaValidator('json', SdkUpdateUserInputV),
        async context => pipe(
          context.req.valid('json'),
          usersService.asUser(context.var.jwt).me.update,
          mapDbRecordAlreadyExistsToSdkError,
          mapDbRecordNotFoundToSdkError,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<UsersMeSdk['update']>>(context),
        ),
      );
  }
}
