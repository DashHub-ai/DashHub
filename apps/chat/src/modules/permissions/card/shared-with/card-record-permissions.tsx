import type { Nullable } from '@llm/commons';

import { isSdkPublicPermissions, type SdkPermissionT } from '@llm/sdk';

import { CardRecordPublic } from './card-record-public';
import { CardRecordSharedWith } from './card-record-shared-with';

type Props = {
  permissions: Nullable<SdkPermissionT[]>;
  className?: string;
};

export function CardRecordPermissions({ permissions, ...props }: Props) {
  if (!permissions) {
    return null;
  }

  if (isSdkPublicPermissions(permissions)) {
    return <CardRecordPublic {...props} />;
  }

  return <CardRecordSharedWith permissions={permissions} {...props} />;
}
