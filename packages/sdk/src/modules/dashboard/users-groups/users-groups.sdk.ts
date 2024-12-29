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
  SdkCreateUsersGroupInputT,
  SdkCreateUsersGroupOutputT,
  SdKSearchUsersGroupsInputT,
  SdkSearchUsersGroupsOutputT,
  SdkUpdateUsersGroupInputT,
  SdkUpdateUsersGroupOutputT,
} from './dto';

export class UsersGroupsSdk extends AbstractNestedSdkWithAuth {
  protected endpointPrefix = '/dashboard/users/groups';

  search = (data: SdKSearchUsersGroupsInputT) =>
    this.fetch<SdkSearchUsersGroupsOutputT>({
      url: this.endpoint('/search'),
      query: data,
      options: getPayload(),
    });

  create = (data: SdkCreateUsersGroupInputT) =>
    this.fetch<SdkCreateUsersGroupOutputT, SdkRecordAlreadyExistsError>({
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

  update = ({ id, ...data }: SdkUpdateUsersGroupInputT & SdkTableRowWithIdT) =>
    this.fetch<
      SdkUpdateUsersGroupOutputT,
      SdkRecordAlreadyExistsError | SdkRecordNotFoundError
    >({
      url: this.endpoint(`/${id}`),
      options: putPayload(data),
    });
};
