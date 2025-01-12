import { isSdkPublicPermissions, type SdkPermissionT } from '@llm/sdk';

import { CardRecordPublic } from './card-record-public';
import { CardRecordSharedWith } from './card-record-shared-with';

type Props = {
  permissions: SdkPermissionT[];
  className?: string;
};

export function CardRecordPermissions({ permissions, ...props }: Props) {
  if (isSdkPublicPermissions(permissions)) {
    return <CardRecordPublic permissions={permissions} {...props} />;
  }

  return <CardRecordSharedWith permissions={permissions} {...props} />;
}
