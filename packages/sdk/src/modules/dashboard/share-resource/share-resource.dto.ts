import { AbstractNestedSdkWithAuth } from '~/modules/abstract-nested-sdk-with-auth';
import { getPayload } from '~/shared';

import type {
  SdkSearchShareResourceUsersGroupsInputT,
  SdkSearchShareResourceUsersGroupsOutputT,
} from './dto';

export class ShareResourceSdk extends AbstractNestedSdkWithAuth {
  protected endpointPrefix = '/dashboard/share-resource';

  search = (dto: SdkSearchShareResourceUsersGroupsInputT) =>
    this.fetch<SdkSearchShareResourceUsersGroupsOutputT>({
      url: this.endpoint('/users-groups/search'),
      query: dto,
      options: getPayload(),
    });
};
