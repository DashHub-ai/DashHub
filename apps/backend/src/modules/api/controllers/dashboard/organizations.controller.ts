import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import {
  type OrganizationsSdk,
  SdkCreateOrganizationInputV,
  SdKSearchOrganizationsInputV,
  SdkUpdateOrganizationInputV,
} from '@llm/sdk';
import { ConfigService } from '~/modules/config';
import { OrganizationsService } from '~/modules/organizations';

import {
  mapDbRecordAlreadyExistsToSdkError,
  mapDbRecordNotFoundToSdkError,
  rejectUnsafeSdkErrors,
  sdkSchemaValidator,
  serializeSdkResponseTE,
} from '../../helpers';
import { AuthorizedController } from '../shared/authorized.controller';

@injectable()
export class OrganizationsController extends AuthorizedController {
  constructor(
    @inject(ConfigService) configService: ConfigService,
    @inject(OrganizationsService) organizationsService: OrganizationsService,
  ) {
    super(configService);

    this.router
      .get(
        '/search',
        sdkSchemaValidator('query', SdKSearchOrganizationsInputV),
        async context => pipe(
          context.req.valid('query'),
          organizationsService.asUser(context.var.jwt).search,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<OrganizationsSdk['search']>>(context),
        ),
      )
      .post(
        '/',
        sdkSchemaValidator('json', SdkCreateOrganizationInputV),
        async context => pipe(
          context.req.valid('json'),
          organizationsService.asUser(context.var.jwt).create,
          mapDbRecordAlreadyExistsToSdkError,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<OrganizationsSdk['create']>>(context),
        ),
      )
      .patch(
        '/archive/:id',
        async context => pipe(
          Number(context.req.param().id),
          organizationsService.asUser(context.var.jwt).archive,
          mapDbRecordNotFoundToSdkError,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<OrganizationsSdk['archive']>>(context),
        ),
      )
      .put(
        '/:id',
        sdkSchemaValidator('json', SdkUpdateOrganizationInputV),
        async context => pipe(
          {
            id: Number(context.req.param().id),
            ...context.req.valid('json'),
          },
          organizationsService.asUser(context.var.jwt).update,
          mapDbRecordAlreadyExistsToSdkError,
          mapDbRecordNotFoundToSdkError,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<OrganizationsSdk['update']>>(context),
        ),
      );
  }
}
