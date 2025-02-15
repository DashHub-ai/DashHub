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
  SdkCreateSearchEngineInputT,
  SdkCreateSearchEngineOutputT,
  SdkSearchEngineT,
  SdkSearchSearchEnginesInputT,
  SdkSearchSearchEnginesOutputT,
  SdkUpdateSearchEngineInputT,
  SdkUpdateSearchEngineOutputT,
} from './dto';

export class SearchEnginesSdk extends AbstractNestedSdkWithAuth {
  protected endpointPrefix = '/dashboard/search-engines';

  getDefault = (organizationId: SdkTableRowIdT) =>
    this.fetch<SdkSearchEngineT, SdkRecordNotFoundError>({
      url: this.endpoint(`/default/${organizationId}`),
      options: getPayload(),
    });

  search = (data: SdkSearchSearchEnginesInputT) =>
    this.fetch<SdkSearchSearchEnginesOutputT>({
      url: this.endpoint('/search'),
      query: data,
      options: getPayload(),
    });

  create = (data: SdkCreateSearchEngineInputT) =>
    this.fetch<SdkCreateSearchEngineOutputT, SdkRecordAlreadyExistsError>({
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

  update = ({ id, ...data }: SdkUpdateSearchEngineInputT & SdkTableRowWithIdT) =>
    this.fetch<
      SdkUpdateSearchEngineOutputT,
      SdkRecordAlreadyExistsError | SdkRecordNotFoundError
    >({
      url: this.endpoint(`/${id}`),
      options: putPayload(data),
    });
};
