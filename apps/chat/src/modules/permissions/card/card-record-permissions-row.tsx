import type { SdkTableRowWithPermissionsT, SdkUserListItemT } from '@dashhub/sdk';

import { CardRecordCreator } from './card-record-creator';
import { CardRecordPermissions } from './shared-with';

type Props = {
  record: SdkTableRowWithPermissionsT & {
    creator?: SdkUserListItemT;
  };
};

export function CardRecordPermissionsRow({ record }: Props) {
  const hasPermissions = record.permissions?.current && record.permissions.current.length !== 1;

  return (
    <div className="flex flex-row items-center gap-x-2">
      {hasPermissions && (
        <CardRecordPermissions permissions={record.permissions.current} />
      )}

      {hasPermissions && record.creator && (
        <div className="bg-gray-200 mx-1 w-[1px] h-4" />
      )}

      {record.creator && (
        <CardRecordCreator creator={record.creator} />
      )}
    </div>
  );
}
