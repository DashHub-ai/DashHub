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
  SdkCreateExpertInputT,
  SdkCreateExpertOutputT,
  SdkSearchExpertsInputT,
  SdkSearchExpertsOutputT,
  SdkUpdateExpertInputT,
  SdkUpdateExpertOutputT,
} from './dto';

export class ExpertsSdk extends AbstractNestedSdkWithAuth {
  protected endpointPrefix = '/dashboard/experts';

  search = (data: SdkSearchExpertsInputT) =>
    this.fetch<SdkSearchExpertsOutputT>({
      url: this.endpoint('/search'),
      query: data,
      options: getPayload(),
    });

  create = (data: SdkCreateExpertInputT) =>
    this.fetch<SdkCreateExpertOutputT, SdkRecordAlreadyExistsError>({
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

  update = ({ id, ...data }: SdkUpdateExpertInputT & SdkTableRowWithIdT) =>
    this.fetch<
      SdkUpdateExpertOutputT,
      SdkRecordAlreadyExistsError | SdkRecordNotFoundError
    >({
      url: this.endpoint(`/${id}`),
      options: putPayload(data),
    });
};
