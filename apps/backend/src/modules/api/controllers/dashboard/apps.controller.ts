import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';
import { z } from 'zod';

import {
  type AppsSdk,
  SdkCreateAppInputV,
  SdkOptionalFileUploadV,
  SdkSearchAppsInputV,
  SdkStrictJsonV,
  SdkUpdateAppInputV,
} from '@dashhub/sdk';
import { AppsService } from '~/modules/apps';
import { ConfigService } from '~/modules/config';

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
export class AppsController extends AuthorizedController {
  constructor(
    @inject(ConfigService) configService: ConfigService,
    @inject(AppsService) appsService: AppsService,
  ) {
    super(configService);

    this.router
      .get('/summarize-chat-to-app/:chatId', async context => pipe(
        context.req.param().chatId,
        appsService.asUser(context.var.jwt).summarizeChatToApp,
        rejectUnsafeSdkErrors,
        serializeSdkResponseTE<ReturnType<AppsSdk['summarizeChatToApp']>>(context),
      ))
      .get(
        '/search',
        sdkSchemaValidator('query', SdkSearchAppsInputV),
        async context => pipe(
          context.req.valid('query'),
          appsService.asUser(context.var.jwt).search,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<AppsSdk['search']>>(context),
        ),
      )
      .get(
        '/:id',
        async context => pipe(
          Number(context.req.param().id),
          appsService.asUser(context.var.jwt).get,
          mapEsDocumentNotFoundToSdkError,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<AppsSdk['get']>>(context),
        ),
      )
      .patch(
        '/archive/:id',
        async context => pipe(
          Number(context.req.param().id),
          appsService.asUser(context.var.jwt).archive,
          mapDbRecordNotFoundToSdkError,
          mapDbRecordAlreadyExistsToSdkError,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<AppsSdk['archive']>>(context),
        ),
      )
      .patch(
        '/unarchive/:id',
        async context => pipe(
          Number(context.req.param().id),
          appsService.asUser(context.var.jwt).unarchive,
          mapDbRecordNotFoundToSdkError,
          mapDbRecordAlreadyExistsToSdkError,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<AppsSdk['unarchive']>>(context),
        ),
      )
      .post(
        '/',
        sdkSchemaValidator('form', z.object({
          logo: SdkOptionalFileUploadV,
          data: SdkStrictJsonV.pipe(SdkCreateAppInputV.omit({
            logo: true,
          })),
        })),
        async (context) => {
          const { logo, data } = context.req.valid('form');

          return pipe(
            extractFileOrListItemOrNilTE(logo),
            TE.chainW(extractedLogo => appsService.asUser(context.var.jwt).create({
              ...data,
              logo: extractedLogo,
            })),
            mapDbRecordAlreadyExistsToSdkError,
            rejectUnsafeSdkErrors,
            serializeSdkResponseTE<ReturnType<AppsSdk['create']>>(context),
          );
        },
      )
      .put(
        '/:id',
        sdkSchemaValidator('form', z.object({
          logo: SdkOptionalFileUploadV,
          data: SdkStrictJsonV.pipe(SdkUpdateAppInputV.omit({
            logo: true,
          })),
        })),
        async (context) => {
          const { logo, data } = context.req.valid('form');

          return pipe(
            extractFileOrListItemOrNilTE(logo),
            TE.chainW(extractedLogo => appsService.asUser(context.var.jwt).update({
              ...data,
              id: Number(context.req.param().id),
              logo: extractedLogo,
            })),
            mapDbRecordAlreadyExistsToSdkError,
            mapDbRecordNotFoundToSdkError,
            rejectUnsafeSdkErrors,
            serializeSdkResponseTE<ReturnType<AppsSdk['update']>>(context),
          );
        },
      );
  }
}
