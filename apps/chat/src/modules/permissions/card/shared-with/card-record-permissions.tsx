import type { Nullable } from '@llm/commons';

import { isSdkPublicPermissions, type SdkPermissionT } from '@llm/sdk';

import { CardRecordSharedWith } from './card-record-shared-with';

type Props = {
  permissions: Nullable<SdkPermissionT[]>;
  className?: string;
};

export function CardRecordPermissions({ permissions, ...props }: Props) {
  if (!permissions || isSdkPublicPermissions(permissions)) {
    return null;
  }

  return <CardRecordSharedWith permissions={permissions} {...props} />;
}
