import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';
import { z } from 'zod';

import {
  type AIExternalAPIsSdk,
  SdkCreateAIExternalAPIInputV,
  SdkOptionalFileUploadV,
  SdkSearchAIExternalAPIsInputV,
  SdkStrictJsonV,
  SdkUpdateAIExternalAPIInputV,
} from '@dashhub/sdk';
import { AIExternalAPIsService } from '~/modules/ai-external-apis';
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
export class AIExternalAPIsController extends AuthorizedController {
  constructor(
    @inject(ConfigService) configService: ConfigService,
    @inject(AIExternalAPIsService) appsService: AIExternalAPIsService,
  ) {
    super(configService);

    this.router
      .get(
        '/search',
        sdkSchemaValidator('query', SdkSearchAIExternalAPIsInputV),
        async context => pipe(
          context.req.valid('query'),
          appsService.asUser(context.var.jwt).search,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<AIExternalAPIsSdk['search']>>(context),
        ),
      )
      .get(
        '/:id',
        async context => pipe(
          Number(context.req.param().id),
          appsService.asUser(context.var.jwt).get,
          mapEsDocumentNotFoundToSdkError,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<AIExternalAPIsSdk['get']>>(context),
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
          serializeSdkResponseTE<ReturnType<AIExternalAPIsSdk['archive']>>(context),
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
          serializeSdkResponseTE<ReturnType<AIExternalAPIsSdk['unarchive']>>(context),
        ),
      )
      .post(
        '/',
        sdkSchemaValidator('form', z.object({
          logo: SdkOptionalFileUploadV,
          data: SdkStrictJsonV.pipe(SdkCreateAIExternalAPIInputV.omit({
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
            serializeSdkResponseTE<ReturnType<AIExternalAPIsSdk['create']>>(context),
          );
        },
      )
      .put(
        '/:id',
        sdkSchemaValidator('form', z.object({
          logo: SdkOptionalFileUploadV,
          data: SdkStrictJsonV.pipe(SdkUpdateAIExternalAPIInputV.omit({
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
            serializeSdkResponseTE<ReturnType<AIExternalAPIsSdk['update']>>(context),
          );
        },
      );
  }
}
