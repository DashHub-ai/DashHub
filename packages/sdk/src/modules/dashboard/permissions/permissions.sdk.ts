import { AbstractNestedSdkWithAuth } from '~/modules/abstract-nested-sdk-with-auth';
import {
  getPayload,
  postPayload,
  type SdkRecordAlreadyExistsError,
  type SdkRecordNotFoundError,
  type SdkSuccessT,
} from '~/shared';

import type { SdkPermissionResourceT, SdkPermissionT, SdkUpsertResourcePermissionsInputT } from './dto';

export class PermissionsSdk extends AbstractNestedSdkWithAuth {
  protected endpointPrefix = '/dashboard/permissions';

  getForResource = (resource: SdkPermissionResourceT) =>
    this.fetch<SdkPermissionT, SdkRecordNotFoundError>({
      url: this.endpoint(`/${resource.type}/${resource.id}`),
      options: getPayload(),
    });

  upsert = (
    resource: SdkPermissionResourceT,
    payload: SdkUpsertResourcePermissionsInputT,
  ) =>
    this.fetch<SdkSuccessT, SdkRecordAlreadyExistsError>({
      url: this.endpoint(`/${resource.type}/${resource.id}`),
      options: postPayload(payload),
    });
};
