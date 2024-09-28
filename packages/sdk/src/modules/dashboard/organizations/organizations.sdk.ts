import { AbstractNestedSdkWithAuth } from '~/modules/abstract-nested-sdk-with-auth';
import {
  getPayload,
  postPayload,
  putPayload,
  type SdkRecordAlreadyExistsError,
  type SdkRecordNotFoundError,
  type SdkTableRowWithIdT,
} from '~/shared';

import type {
  SdkCreateOrganizationInputT,
  SdkCreateOrganizationOutputT,
  SdKSearchOrganizationsInputT,
  SdKSearchOrganizationsOutputT,
  SdkUpdateOrganizationInputT,
  SdkUpdateOrganizationOutputT,
} from './dto';

export class OrganizationsSdk extends AbstractNestedSdkWithAuth {
  protected endpointPrefix = '/dashboard/organizations';

  search = (data: SdKSearchOrganizationsInputT) =>
    this.fetch<SdKSearchOrganizationsOutputT>({
      url: this.endpoint('/search'),
      query: data,
      options: getPayload(),
    });

  create = (data: SdkCreateOrganizationInputT) =>
    this.fetch<SdkCreateOrganizationOutputT, SdkRecordAlreadyExistsError>({
      url: this.endpoint('/'),
      options: postPayload(data),
    });

  update = ({ id, ...data }: SdkUpdateOrganizationInputT & SdkTableRowWithIdT) =>
    this.fetch<
      SdkUpdateOrganizationOutputT,
      SdkRecordAlreadyExistsError | SdkRecordNotFoundError
    >({
      url: this.endpoint(`/${id}`),
      options: putPayload(data),
    });
};
