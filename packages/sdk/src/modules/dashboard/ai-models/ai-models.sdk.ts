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
  SdkAIModelT,
  SdkCreateAIModelInputT,
  SdkCreateAIModelOutputT,
  SdkSearchAIModelsInputT,
  SdkSearchAIModelsOutputT,
  SdkUpdateAIModelInputT,
  SdkUpdateAIModelOutputT,
} from './dto';

export class AIModelsSdk extends AbstractNestedSdkWithAuth {
  protected endpointPrefix = '/dashboard/ai-models';

  getDefault = (organizationId: SdkTableRowIdT) =>
    this.fetch<SdkAIModelT, SdkRecordNotFoundError>({
      url: this.endpoint(`/default/${organizationId}`),
      options: getPayload(),
    });

  search = (data: SdkSearchAIModelsInputT) =>
    this.fetch<SdkSearchAIModelsOutputT>({
      url: this.endpoint('/search'),
      query: data,
      options: getPayload(),
    });

  create = (data: SdkCreateAIModelInputT) =>
    this.fetch<SdkCreateAIModelOutputT, SdkRecordAlreadyExistsError>({
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

  update = ({ id, ...data }: SdkUpdateAIModelInputT & SdkTableRowWithIdT) =>
    this.fetch<
      SdkUpdateAIModelOutputT,
      SdkRecordAlreadyExistsError | SdkRecordNotFoundError
    >({
      url: this.endpoint(`/${id}`),
      options: putPayload(data),
    });
};
