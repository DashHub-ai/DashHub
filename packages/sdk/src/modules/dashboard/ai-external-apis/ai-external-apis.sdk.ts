import { pipe } from 'fp-ts/lib/function';

import { AbstractNestedSdkWithAuth } from '~/modules/abstract-nested-sdk-with-auth';
import {
  formDataPayload,
  getPayload,
  jsonToFormData,
  patchPayload,
  type SdkInvalidFileFormatError,
  type SdkRecordAlreadyExistsError,
  type SdkRecordNotFoundError,
  type SdkTableRowIdT,
  type SdkTableRowWithIdT,
} from '~/shared';

import type {
  SdkAIExternalApiT,
  SdkCreateAIExternalAPIInputT,
  SdkCreateAIExternalAPIOutputT,
  SdkSearchAIExternalAPIsInputT,
  SdkSearchAIExternalAPIsOutputT,
  SdkUpdateAIExternalAPIInputT,
  SdkUpdateAIExternalAPIOutputT,
} from './dto';

export class AIExternalAPIsSdk extends AbstractNestedSdkWithAuth {
  protected endpointPrefix = '/dashboard/ai-external-apis';

  get = (id: SdkTableRowIdT) =>
    this.fetch<SdkAIExternalApiT, SdkRecordNotFoundError>({
      url: this.endpoint(`/${id}`),
      options: getPayload(),
    });

  search = (data: SdkSearchAIExternalAPIsInputT) =>
    this.fetch<SdkSearchAIExternalAPIsOutputT>({
      url: this.endpoint('/search'),
      query: data,
      options: getPayload(),
    });

  create = ({ logo, ...data }: SdkCreateAIExternalAPIInputT) =>
    this.fetch<SdkCreateAIExternalAPIOutputT, SdkRecordAlreadyExistsError | SdkInvalidFileFormatError>({
      url: this.endpoint('/'),
      options: pipe(
        jsonToFormData({
          logo,
          data: JSON.stringify(data),
        }),
        formDataPayload('POST'),
      ),
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

  update = ({ id, logo, ...data }: SdkUpdateAIExternalAPIInputT & SdkTableRowWithIdT) =>
    this.fetch<
      SdkUpdateAIExternalAPIOutputT,
      SdkRecordAlreadyExistsError | SdkRecordNotFoundError | SdkInvalidFileFormatError
    >({
      url: this.endpoint(`/${id}`),
      options: pipe(
        jsonToFormData({
          logo,
          data: JSON.stringify(data),
        }),
        formDataPayload('PUT'),
      ),
    });
};
