import type { SdkTableRowWithIdT } from '~/shared';

export function isSdkRecordWithOrganization(record: any): record is WithSdkOrganization {
  return 'organization' in record && record.organization.id !== undefined;
}

export type WithSdkOrganization = {
  organization: SdkTableRowWithIdT;
};
