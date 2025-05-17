import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import {
  type AIModelsSdk,
  SdkCreateAIModelInputV,
  SdkSearchAIModelsInputV,
  SdkUpdateAIModelInputV,
} from '@dashhub/sdk';
import { AIModelsService } from '~/modules/ai-models';
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
export class AIModelsController extends AuthorizedController {
  constructor(
    @inject(ConfigService) configService: ConfigService,
    @inject(AIModelsService) aiModelsService: AIModelsService,
  ) {
    super(configService);

    this.router
      .get('/default/:organizationId', async context => pipe(
        Number(context.req.param().organizationId),
        aiModelsService.asUser(context.var.jwt).getDefault,
        mapEsDocumentNotFoundToSdkError,
        rejectUnsafeSdkErrors,
        serializeSdkResponseTE<ReturnType<AIModelsSdk['getDefault']>>(context),
      ))
      .get(
        '/search',
        sdkSchemaValidator('query', SdkSearchAIModelsInputV),
        async context => pipe(
          context.req.valid('query'),
          aiModelsService.asUser(context.var.jwt).search,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<AIModelsSdk['search']>>(context),
        ),
      )
      .post(
        '/',
        sdkSchemaValidator('json', SdkCreateAIModelInputV),
        async context => pipe(
          context.req.valid('json'),
          aiModelsService.asUser(context.var.jwt).create,
          mapDbRecordAlreadyExistsToSdkError,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<AIModelsSdk['create']>>(context),
        ),
      )
      .patch(
        '/archive/:id',
        async context => pipe(
          Number(context.req.param().id),
          aiModelsService.asUser(context.var.jwt).archive,
          mapDbRecordNotFoundToSdkError,
          mapDbRecordAlreadyExistsToSdkError,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<AIModelsSdk['archive']>>(context),
        ),
      )
      .patch(
        '/unarchive/:id',
        async context => pipe(
          Number(context.req.param().id),
          aiModelsService.asUser(context.var.jwt).unarchive,
          mapDbRecordNotFoundToSdkError,
          mapDbRecordAlreadyExistsToSdkError,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<AIModelsSdk['unarchive']>>(context),
        ),
      )
      .put(
        '/:id',
        sdkSchemaValidator('json', SdkUpdateAIModelInputV),
        async context => pipe(
          {
            id: Number(context.req.param().id),
            ...context.req.valid('json'),
          },
          aiModelsService.asUser(context.var.jwt).update,
          mapDbRecordAlreadyExistsToSdkError,
          mapDbRecordNotFoundToSdkError,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<AIModelsSdk['update']>>(context),
        ),
      );
  }
}
