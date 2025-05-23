import { AbstractNestedSdkWithAuth } from '~/modules/abstract-nested-sdk-with-auth';
import {
  getPayload,
  patchPayload,
  postPayload,
  putPayload,
  type SdkRecordAlreadyExistsError,
  type SdkRecordNotFoundError,
  type SdkTableRowIdT,
  type SdkTableRowWithIdT,
} from '~/shared';

import type {
  SdkCreateOrganizationInputT,
  SdkCreateOrganizationOutputT,
  SdkOrganizationT,
  SdkSearchOrganizationsInputT,
  SdkSearchOrganizationsOutputT,
  SdkUpdateOrganizationInputT,
  SdkUpdateOrganizationOutputT,
} from './dto';

export class OrganizationsSdk extends AbstractNestedSdkWithAuth {
  protected endpointPrefix = '/dashboard/organizations';

  get = (id: SdkTableRowIdT) =>
    this.fetch<SdkOrganizationT>({
      url: this.endpoint(`/${id}`),
      options: getPayload(),
    });

  search = (data: SdkSearchOrganizationsInputT) =>
    this.fetch<SdkSearchOrganizationsOutputT>({
      url: this.endpoint('/search'),
      query: data,
      options: getPayload(),
    });

  create = (data: SdkCreateOrganizationInputT) =>
    this.fetch<SdkCreateOrganizationOutputT, SdkRecordAlreadyExistsError>({
      url: this.endpoint('/'),
      options: postPayload(data),
    });

  unarchive = (id: SdkTableRowIdT) =>
    this.fetch<
      SdkTableRowWithIdT,
      SdkRecordNotFoundError | SdkRecordAlreadyExistsError
    >({
      url: this.endpoint(`/unarchive/${id}`),
      options: patchPayload({}),
    });

  archive = (id: SdkTableRowIdT) =>
    this.fetch<
      SdkTableRowWithIdT,
      SdkRecordNotFoundError | SdkRecordAlreadyExistsError
    >({
      url: this.endpoint(`/archive/${id}`),
      options: patchPayload({}),
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
