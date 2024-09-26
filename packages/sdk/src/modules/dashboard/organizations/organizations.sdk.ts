import { AbstractNestedSdkWithAuth } from '~/modules/abstract-nested-sdk-with-auth';

export class OrganizationsSdk extends AbstractNestedSdkWithAuth {
  protected endpointPrefix = '/dashboard/auth';
};
