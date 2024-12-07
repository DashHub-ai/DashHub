import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import {
  AppsCategoriesSdk,
  SdkCreateAppCategoryInputV,
  SdKSearchAppsCategoriesInputV,
  SdkUpdateAppCategoryInputV,
} from '@llm/sdk';
import { AppsCategoriesService } from '~/modules/apps-categories';
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
export class AppsCategoriesController extends AuthorizedController {
  constructor(
    @inject(ConfigService) configService: ConfigService,
    @inject(AppsCategoriesService) appsCategoriesService: AppsCategoriesService,
  ) {
    super(configService);

    this.router
      .get(
        '/search',
        sdkSchemaValidator('query', SdKSearchAppsCategoriesInputV),
        async context => pipe(
          context.req.valid('query'),
          appsCategoriesService.asUser(context.var.jwt).search,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<AppsCategoriesSdk['search']>>(context),
        ),
      )
      .get(
        '/:id',
        async context => pipe(
          Number(context.req.param().id),
          appsCategoriesService.asUser(context.var.jwt).get,
          mapEsDocumentNotFoundToSdkError,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<AppsCategoriesSdk['get']>>(context),
        ),
      )
      .post(
        '/',
        sdkSchemaValidator('json', SdkCreateAppCategoryInputV),
        async context => pipe(
          context.req.valid('json'),
          appsCategoriesService.asUser(context.var.jwt).create,
          mapDbRecordAlreadyExistsToSdkError,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<AppsCategoriesSdk['create']>>(context),
        ),
      )
      .patch(
        '/archive/:id',
        async context => pipe(
          Number(context.req.param().id),
          appsCategoriesService.asUser(context.var.jwt).archive,
          mapDbRecordNotFoundToSdkError,
          mapDbRecordAlreadyExistsToSdkError,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<AppsCategoriesSdk['archive']>>(context),
        ),
      )
      .patch(
        '/unarchive/:id',
        async context => pipe(
          Number(context.req.param().id),
          appsCategoriesService.asUser(context.var.jwt).unarchive,
          mapDbRecordNotFoundToSdkError,
          mapDbRecordAlreadyExistsToSdkError,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<AppsCategoriesSdk['unarchive']>>(context),
        ),
      )
      .put(
        '/:id',
        sdkSchemaValidator('json', SdkUpdateAppCategoryInputV),
        async context => pipe(
          {
            id: Number(context.req.param().id),
            ...context.req.valid('json'),
          },
          appsCategoriesService.asUser(context.var.jwt).update,
          mapDbRecordAlreadyExistsToSdkError,
          mapDbRecordNotFoundToSdkError,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<AppsCategoriesSdk['update']>>(context),
        ),
      );
  }
}
