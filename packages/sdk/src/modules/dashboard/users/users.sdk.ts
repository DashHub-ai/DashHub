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
  SdkCreateUserInputT,
  SdkCreateUserOutputT,
  SdkSearchUsersInputT,
  SdkSearchUsersOutputT,
  SdkUpdateUserInputT,
  SdkUpdateUserOutputT,
} from './dto';

import { UsersMeSdk } from './users-me.sdk';

export class UsersSdk extends AbstractNestedSdkWithAuth {
  protected endpointPrefix = '/dashboard/users';

  public readonly me = new UsersMeSdk(this.config);

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
    this.fetch<SdkSearchUsersOutputT>({
      url: this.endpoint('/search'),
      query: data,
      options: getPayload(),
    });

  create = ({ avatar, ...data }: SdkCreateUserInputT) =>
    this.fetch<SdkCreateUserOutputT, SdkRecordAlreadyExistsError | SdkInvalidFileFormatError>({
      url: this.endpoint('/'),
      options: pipe(
        jsonToFormData({
          avatar,
          data: JSON.stringify(data),
        }),
        formDataPayload('POST'),
      ),
    });

  update = ({ id, avatar, ...data }: SdkUpdateUserInputT & SdkTableRowWithIdT) =>
    this.fetch<
      SdkUpdateUserOutputT,
      SdkRecordAlreadyExistsError | SdkRecordNotFoundError | SdkInvalidFileFormatError
    >({
      url: this.endpoint(`/${id}`),
      options: pipe(
        jsonToFormData({
          avatar,
          data: JSON.stringify(data),
        }),
        formDataPayload('PUT'),
      ),
    });
};
