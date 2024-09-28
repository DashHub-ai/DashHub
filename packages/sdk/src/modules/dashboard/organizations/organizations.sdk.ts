import { AbstractNestedSdkWithAuth } from '~/modules/abstract-nested-sdk-with-auth';
import { getPayload, performApiRequest } from '~/shared';

import type {
  SdKSearchOrganizationsInputT,
  SdKSearchOrganizationsOutputT,
} from './dto';

export class OrganizationsSdk extends AbstractNestedSdkWithAuth {
  protected endpointPrefix = '/dashboard/auth';

  search = (data: SdKSearchOrganizationsInputT) =>
    performApiRequest<SdKSearchOrganizationsOutputT>({
      url: this.endpoint('/login/email'),
      query: data,
      options: getPayload(),
    });
};
