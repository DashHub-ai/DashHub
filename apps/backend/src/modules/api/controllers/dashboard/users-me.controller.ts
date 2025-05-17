import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';
import { z } from 'zod';

import { SdkOptionalFileUploadV, SdkStrictJsonV, SdkUpdateUserInputV, type UsersMeSdk } from '@dashhub/sdk';
import { ConfigService } from '~/modules/config';
import { UsersService } from '~/modules/users';

import {
  extractFileOrListItemOrNilTE,
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
        sdkSchemaValidator('form', z.object({
          avatar: SdkOptionalFileUploadV,
          data: SdkStrictJsonV.pipe(SdkUpdateUserInputV),
        })),
        async (context) => {
          const { avatar, data } = context.req.valid('form');

          return pipe(
            extractFileOrListItemOrNilTE(avatar),
            TE.chainW(extractedAvatar => usersService.asUser(context.var.jwt).update({
              ...data,
              id: context.var.jwt.sub,
              avatar: extractedAvatar,
            })),
            mapDbRecordAlreadyExistsToSdkError,
            mapDbRecordNotFoundToSdkError,
            rejectUnsafeSdkErrors,
            serializeSdkResponseTE<ReturnType<UsersMeSdk['update']>>(context),
          );
        },
      );
  }
}
