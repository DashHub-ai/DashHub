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
  SdkCreateUserInputT,
  SdkCreateUserOutputT,
  SdkSearchUsersInputT,
  SdKSearchUsersOutputT,
  SdkUpdateUserInputT,
  SdkUpdateUserOutputT,
} from './dto';

export class UsersSdk extends AbstractNestedSdkWithAuth {
  protected endpointPrefix = '/dashboard/users';

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

  search = (data: SdkSearchUsersInputT) =>
    this.fetch<SdKSearchUsersOutputT>({
      url: this.endpoint('/search'),
      query: data,
      options: getPayload(),
    });

  create = (data: SdkCreateUserInputT) =>
    this.fetch<SdkCreateUserOutputT, SdkRecordAlreadyExistsError>({
      url: this.endpoint('/'),
      options: postPayload(data),
    });

  update = ({ id, ...data }: SdkUpdateUserInputT & SdkTableRowWithIdT) =>
    this.fetch<
      SdkUpdateUserOutputT,
      SdkRecordAlreadyExistsError | SdkRecordNotFoundError
    >({
      url: this.endpoint(`/${id}`),
      options: putPayload(data),
    });
};
