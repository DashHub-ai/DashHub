import { pipe } from 'fp-ts/lib/function';

import { AbstractNestedSdkWithAuth } from '~/modules/abstract-nested-sdk-with-auth';
import {
  formDataPayload,
  jsonToFormData,
  type SdkInvalidFileFormatError,
  type SdkRecordAlreadyExistsError,
  type SdkRecordNotFoundError,
} from '~/shared';

import type {
  SdkUpdateUserInputT,
  SdkUpdateUserOutputT,
  SdkUserT,
} from './dto';

export class UsersMeSdk extends AbstractNestedSdkWithAuth {
  protected endpointPrefix = '/dashboard/users/me';

  get = () =>
    this.fetch<SdkUserT, SdkRecordNotFoundError>({
      url: this.endpoint('/'),
    });

  update = ({ avatar, ...data }: SdkUpdateUserInputT) =>
    this.fetch<
      SdkUpdateUserOutputT,
      SdkRecordAlreadyExistsError | SdkRecordNotFoundError | SdkInvalidFileFormatError
    >({
      url: this.endpoint('/'),
      options: pipe(
        jsonToFormData({
          avatar,
          data: JSON.stringify(data),
        }),
        formDataPayload('PUT'),
      ),
    });
};
