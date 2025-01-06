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
  SdkAppCategoryT,
  SdkCreateAppCategoryInputT,
  SdkCreateAppCategoryOutputT,
  SdkSearchAppsCategoriesInputT,
  SdkSearchAppsCategoriesOutputT,
  SdkUpdateAppCategoryInputT,
  SdkUpdateAppCategoryOutputT,
} from './dto';

export class AppsCategoriesSdk extends AbstractNestedSdkWithAuth {
  protected endpointPrefix = '/dashboard/apps/categories';

  get = (id: SdkTableRowIdT) =>
    this.fetch<SdkAppCategoryT, SdkRecordNotFoundError>({
      url: this.endpoint(`/${id}`),
      options: getPayload(),
    });

  search = (data: SdkSearchAppsCategoriesInputT) =>
    this.fetch<SdkSearchAppsCategoriesOutputT>({
      url: this.endpoint('/search'),
      query: data,
      options: getPayload(),
    });

  create = (data: SdkCreateAppCategoryInputT) =>
    this.fetch<SdkCreateAppCategoryOutputT, SdkRecordAlreadyExistsError>({
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

  update = ({ id, ...data }: SdkUpdateAppCategoryInputT & SdkTableRowWithIdT) =>
    this.fetch<
      SdkUpdateAppCategoryOutputT,
      SdkRecordAlreadyExistsError | SdkRecordNotFoundError
    >({
      url: this.endpoint(`/${id}`),
      options: putPayload(data),
    });
};
