import type { SdkTableRowWithIdT } from '~/shared';

export function isSdkRecordWithCreator(record: any): record is WithSdkCreator {
  return 'creator' in record && record.creator.id !== undefined;
}

export type WithSdkCreator = {
  creator: SdkTableRowWithIdT;
};
