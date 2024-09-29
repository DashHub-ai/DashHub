import { AbstractNestedSdkWithAuth } from '~/modules/abstract-nested-sdk-with-auth';
import { getPayload, postPayload, type SdkRecordAlreadyExistsError } from '~/shared';

import type {
  SdkCreateUserInputT,
  SdkCreateUserOutputT,
  SdKSearchUsersInputT,
  SdKSearchUsersOutputT,
} from './dto';

export class UsersSdk extends AbstractNestedSdkWithAuth {
  protected endpointPrefix = '/dashboard/users';

  search = (data: SdKSearchUsersInputT) =>
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
};
