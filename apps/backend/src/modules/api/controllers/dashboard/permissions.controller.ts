import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import { ofSdkSuccess, PermissionsSdk, SdkPermissionResourceV, SdkUpsertResourcePermissionsInputV } from '@llm/sdk';
import { ConfigService } from '~/modules/config';
import { PermissionsService } from '~/modules/permissions';

import {
  mapDbRecordAlreadyExistsToSdkError,
  mapEsDocumentNotFoundToSdkError,
  rejectUnsafeSdkErrors,
  sdkSchemaValidator,
  serializeSdkResponseTE,
} from '../../helpers';
import { AuthorizedController } from '../shared/authorized.controller';

@injectable()
export class PermissionsController extends AuthorizedController {
  constructor(
    @inject(ConfigService) configService: ConfigService,
    @inject(PermissionsService) permissionsService: PermissionsService,
  ) {
    super(configService);

    this.router
      .get(
        '/:type/:id',
        sdkSchemaValidator('param', SdkPermissionResourceV),
        async context => pipe(
          context.req.valid('param'),
          permissionsService.asUser(context.var.jwt).getByResource,
          mapEsDocumentNotFoundToSdkError,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<PermissionsSdk['getForResource']>>(context),
        ),
      )
      .patch(
        '/:type/:id',
        sdkSchemaValidator('param', SdkPermissionResourceV),
        sdkSchemaValidator('json', SdkUpsertResourcePermissionsInputV),
        async context => pipe(
          permissionsService.asUser(context.var.jwt).upsert({
            resource: context.req.valid('param'),
            permissions: context.req.valid('json'),
          }),
          mapDbRecordAlreadyExistsToSdkError,
          rejectUnsafeSdkErrors,
          TE.map(ofSdkSuccess),
          serializeSdkResponseTE<ReturnType<PermissionsSdk['upsert']>>(context),
        ),
      );
  }
}
