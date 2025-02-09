import { AbstractNestedSdkWithAuth } from '~/modules/abstract-nested-sdk-with-auth';
import {
  putPayload,
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

  update = (data: SdkUpdateUserInputT) =>
    this.fetch<
      SdkUpdateUserOutputT,
      SdkRecordAlreadyExistsError | SdkRecordNotFoundError
    >({
      url: this.endpoint('/'),
      options: putPayload(data),
    });
};
