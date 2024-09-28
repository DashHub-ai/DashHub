import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import { type OrganizationsSdk, SdKSearchOrganizationsInputV } from '@llm/sdk';
import { ConfigService } from '~/modules/config';
import { OrganizationsService } from '~/modules/organizations';

import { rejectUnsafeSdkErrors, sdkSchemaValidator, serializeSdkResponseTE } from '../helpers';
import { AuthorizedController } from './shared/authorized.controller';

@injectable()
export class OrganizationsController extends AuthorizedController {
  constructor(
    @inject(ConfigService) configService: ConfigService,
    @inject(OrganizationsService) organizationsService: OrganizationsService,
  ) {
    super(configService);

    this.router
      .post(
        '/search',
        sdkSchemaValidator('query', SdKSearchOrganizationsInputV),
        async context => pipe(
          context.req.valid('query'),
          organizationsService.asUser(context.var.jwt).search,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<OrganizationsSdk['search']>>(context),
        ),
      );
  }
}
