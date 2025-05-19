import type { Nullable } from '@dashhub/commons';

import { isSdkPublicPermissions, type SdkPermissionT, useSdkForLoggedIn } from '@dashhub/sdk';

import { CardRecordPublic } from './card-record-public';
import { CardRecordSharedWith } from './card-record-shared-with';

type Props = {
  permissions: Nullable<SdkPermissionT[]>;
  className?: string;
};

export function CardRecordPermissions({ permissions, ...props }: Props) {
  const { guard } = useSdkForLoggedIn();

  if (!permissions) {
    return null;
  }

  if (isSdkPublicPermissions(permissions)) {
    return guard.is.minimum.techUser ? <CardRecordPublic {...props} /> : null;
  }

  return <CardRecordSharedWith permissions={permissions} {...props} />;
}
