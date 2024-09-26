import { AbstractNestedSdkWithAuth } from '~/modules/abstract-nested-sdk-with-auth';

export class UsersSdk extends AbstractNestedSdkWithAuth {
  protected endpointPrefix = '/dashboard/users';
};
