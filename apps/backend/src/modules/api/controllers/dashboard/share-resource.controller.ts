import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import {
  SdkSearchShareResourceUsersGroupsInputV,
  type ShareResourceSdk,
} from '@llm/sdk';
import { ConfigService } from '~/modules/config';
import { ShareResourceService } from '~/modules/share-resource';

import {
  rejectUnsafeSdkErrors,
  sdkSchemaValidator,
  serializeSdkResponseTE,
} from '../../helpers';
import { AuthorizedController } from '../shared/authorized.controller';

@injectable()
export class ShareResourceController extends AuthorizedController {
  constructor(
    @inject(ConfigService) configService: ConfigService,
    @inject(ShareResourceService) shareResourceService: ShareResourceService,
  ) {
    super(configService);

    this.router
      .get(
        '/users-groups/search',
        sdkSchemaValidator('query', SdkSearchShareResourceUsersGroupsInputV),
        async context => pipe(
          context.req.valid('query'),
          shareResourceService.asUser(context.var.jwt).searchShareableUsersAndGroups,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<ShareResourceSdk['searchUsersAndGroups']>>(context),
        ),
      );
  }
}
