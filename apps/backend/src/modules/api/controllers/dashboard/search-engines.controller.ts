import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import {
  SdkCreateSearchEngineInputV,
  SdkSearchSearchEnginesInputV,
  SdkUpdateSearchEngineInputV,
  type SearchEnginesSdk,
} from '@dashhub/sdk';
import { ConfigService } from '~/modules/config';
import { SearchEnginesService } from '~/modules/search-engines';

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
export class SearchEnginesController extends AuthorizedController {
  constructor(
    @inject(ConfigService) configService: ConfigService,
    @inject(SearchEnginesService) aiModelsService: SearchEnginesService,
  ) {
    super(configService);

    this.router
      .get('/default/:organizationId', async context => pipe(
        Number(context.req.param().organizationId),
        aiModelsService.asUser(context.var.jwt).getDefault,
        mapEsDocumentNotFoundToSdkError,
        rejectUnsafeSdkErrors,
        serializeSdkResponseTE<ReturnType<SearchEnginesSdk['getDefault']>>(context),
      ))
      .get(
        '/search',
        sdkSchemaValidator('query', SdkSearchSearchEnginesInputV),
        async context => pipe(
          context.req.valid('query'),
          aiModelsService.asUser(context.var.jwt).search,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<SearchEnginesSdk['search']>>(context),
        ),
      )
      .post(
        '/',
        sdkSchemaValidator('json', SdkCreateSearchEngineInputV),
        async context => pipe(
          context.req.valid('json'),
          aiModelsService.asUser(context.var.jwt).create,
          mapDbRecordAlreadyExistsToSdkError,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<SearchEnginesSdk['create']>>(context),
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
          serializeSdkResponseTE<ReturnType<SearchEnginesSdk['archive']>>(context),
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
          serializeSdkResponseTE<ReturnType<SearchEnginesSdk['unarchive']>>(context),
        ),
      )
      .put(
        '/:id',
        sdkSchemaValidator('json', SdkUpdateSearchEngineInputV),
        async context => pipe(
          {
            id: Number(context.req.param().id),
            ...context.req.valid('json'),
          },
          aiModelsService.asUser(context.var.jwt).update,
          mapDbRecordAlreadyExistsToSdkError,
          mapDbRecordNotFoundToSdkError,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<SearchEnginesSdk['update']>>(context),
        ),
      );
  }
}
