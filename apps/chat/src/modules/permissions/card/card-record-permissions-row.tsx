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
    <div className="flex flex-col items-start gap-y-3">
      {hasPermissions && (
        <CardRecordPermissions permissions={record.permissions.current} />
      )}

      {record.creator && (
        <CardRecordCreator creator={record.creator} />
      )}
    </div>
  );
}
