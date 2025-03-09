import { pipe } from 'fp-ts/lib/function';

import { tapTaskEither } from '@llm/commons';
import {
  castSdkChatToUpdateInput,
  type SdkChatT,
  type SdkPermissionT,
  useSdkForLoggedIn,
} from '@llm/sdk';
import { PermissionAvatarsList, ShareResourceButton } from '~/modules/permissions';

type Props = {
  chat: SdkChatT;
  onPermissionsUpdated: VoidFunction;
};

export function ShareChatNavigationRow({ chat, onPermissionsUpdated }: Props) {
  const { permissions, creator } = chat;
  const { sdks } = useSdkForLoggedIn();

  const onUpdatePermissions = (permissions: SdkPermissionT[]) => pipe(
    sdks.dashboard.chats.update({
      ...castSdkChatToUpdateInput(chat),
      permissions,
    }),
    tapTaskEither(onPermissionsUpdated),
  );

  return (
    <div className="flex items-center gap-6">
      <PermissionAvatarsList permissions={permissions?.current ?? []} />
      <ShareResourceButton
        creator={creator}
        defaultValue={permissions?.current ?? []}
        onSubmit={onUpdatePermissions}
      />
    </div>
  );
}
