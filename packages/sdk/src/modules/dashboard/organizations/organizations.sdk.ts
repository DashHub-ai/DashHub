import { AbstractNestedSdkWithAuth } from '~/modules/abstract-nested-sdk-with-auth';
import {
  getPayload,
  performApiRequest,
  postPayload,
  type SdkRecordAlreadyExistsError,
} from '~/shared';

import type {
  SdkCreateOrganizationInputT,
  SdkCreateOrganizationOutputT,
  SdKSearchOrganizationsInputT,
  SdKSearchOrganizationsOutputT,
} from './dto';

export class OrganizationsSdk extends AbstractNestedSdkWithAuth {
  protected endpointPrefix = '/dashboard/organizations';

  search = (data: SdKSearchOrganizationsInputT) =>
    performApiRequest<SdKSearchOrganizationsOutputT>({
      url: this.endpoint('/search'),
      query: data,
      options: getPayload(),
    });

  create = (data: SdkCreateOrganizationInputT) =>
    performApiRequest<SdkCreateOrganizationOutputT, SdkRecordAlreadyExistsError>({
      url: this.endpoint('/create'),
      options: postPayload(data),
    });
};
