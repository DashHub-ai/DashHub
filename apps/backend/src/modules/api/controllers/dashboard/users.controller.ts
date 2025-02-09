import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';
import { z } from 'zod';

import {
  SdkCreateUserInputV,
  SdkOptionalFileUploadV,
  SdkSearchUsersInputV,
  SdkStrictJsonV,
  SdkUpdateUserInputV,
  type UsersSdk,
} from '@llm/sdk';
import { ConfigService } from '~/modules/config';
import { UsersService } from '~/modules/users';

import {
  extractFileOrListItemOrNilTE,
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
        sdkSchemaValidator('form', z.object({
          avatar: SdkOptionalFileUploadV,
          data: SdkStrictJsonV.pipe(SdkCreateUserInputV),
        })),
        async (context) => {
          const { avatar, data } = context.req.valid('form');

          return pipe(
            extractFileOrListItemOrNilTE(avatar),
            TE.chainW(extractedAvatar => usersService.asUser(context.var.jwt).create({
              ...data,
              avatar: extractedAvatar,
            })),
            mapDbRecordAlreadyExistsToSdkError,
            rejectUnsafeSdkErrors,
            serializeSdkResponseTE<ReturnType<UsersSdk['create']>>(context),
          );
        },
      )
      .put(
        '/:id',
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
              id: Number(context.req.param().id),
              avatar: extractedAvatar,
            })),
            mapDbRecordAlreadyExistsToSdkError,
            mapDbRecordNotFoundToSdkError,
            rejectUnsafeSdkErrors,
            serializeSdkResponseTE<ReturnType<UsersSdk['update']>>(context),
          );
        },
      );
  }
}
