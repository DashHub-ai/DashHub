import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import {
  type AppsSdk,
  SdkCreateAppInputV,
  SdkSearchAppsInputV,
  SdkUpdateAppInputV,
} from '@llm/sdk';
import { AppsService } from '~/modules/apps';
import { ConfigService } from '~/modules/config';

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
export class AppsController extends AuthorizedController {
  constructor(
    @inject(ConfigService) configService: ConfigService,
    @inject(AppsService) appsService: AppsService,
  ) {
    super(configService);

    this.router
      .get('/summarize-chat-to-app/:chatId', async context => pipe(
        {
          id: context.req.param().chatId,
        },
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
      .post(
        '/',
        sdkSchemaValidator('json', SdkCreateAppInputV),
        async context => pipe(
          context.req.valid('json'),
          appsService.asUser(context.var.jwt).create,
          mapDbRecordAlreadyExistsToSdkError,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<AppsSdk['create']>>(context),
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
      .put(
        '/:id',
        sdkSchemaValidator('json', SdkUpdateAppInputV),
        async context => pipe(
          {
            id: Number(context.req.param().id),
            ...context.req.valid('json'),
          },
          appsService.asUser(context.var.jwt).update,
          mapDbRecordAlreadyExistsToSdkError,
          mapDbRecordNotFoundToSdkError,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<AppsSdk['update']>>(context),
        ),
      );
  }
}
