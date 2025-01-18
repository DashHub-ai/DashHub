import type { SdkTableRowWithPermissionsT, SdkUserListItemT } from '@llm/sdk';

import { CardRecordCreator } from './card-record-creator';
import { CardRecordPermissions } from './shared-with';

type Props = {
  record: SdkTableRowWithPermissionsT & {
    creator?: SdkUserListItemT;
  };
};

export function CardRecordPermissionsRows({ record }: Props) {
  return (
    <div className="flex flex-col gap-y-4">
      {record.creator && (
        <CardRecordCreator
          creator={record.creator}
          className="text-sm"
        />
      )}

      {record.permissions?.current && record.permissions.current.length !== 1 && (
        <CardRecordPermissions
          permissions={record.permissions.current}
          className="text-sm"
        />
      )}
    </div>
  );
}
