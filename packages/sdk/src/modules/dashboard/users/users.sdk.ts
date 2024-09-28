import { AbstractNestedSdkWithAuth } from '~/modules/abstract-nested-sdk-with-auth';
import { postPayload, type SdkRecordAlreadyExistsError } from '~/shared';

import type { SdkCreateUserInputT, SdkCreateUserOutputT } from './dto';

export class UsersSdk extends AbstractNestedSdkWithAuth {
  protected endpointPrefix = '/dashboard/users';

  create = (data: SdkCreateUserInputT) =>
    this.fetch<SdkCreateUserOutputT, SdkRecordAlreadyExistsError>({
      url: this.endpoint('/'),
      options: postPayload(data),
    });
};
