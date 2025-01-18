import type { SdkTableRowWithPermissionsT, SdkUserListItemT } from '@llm/sdk';

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
    <div className="flex flex-row items-center gap-x-4">
      {record.creator && (
        <>
          <CardRecordCreator creator={record.creator} />
          {hasPermissions && (
            <div className="bg-gray-300 w-px h-4" />
          )}
        </>
      )}

      {hasPermissions && (
        <CardRecordPermissions permissions={record.permissions.current} />
      )}
    </div>
  );
}
