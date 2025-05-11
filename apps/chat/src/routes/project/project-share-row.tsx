import { pipe } from 'fp-ts/lib/function';

import { tapTaskEither } from '@dashhub/commons';
import {
  castSdkProjectToUpdateInput,
  type SdkPermissionT,
  type SdkProjectT,
  useSdkForLoggedIn,
} from '@dashhub/sdk';
import {
  PermissionAvatarsList,
  ShareResourceButton,
} from '~/modules/permissions';

type Props = {
  project: SdkProjectT;
  onShared: VoidFunction;
};

export function ProjectShareRow({ project, onShared }: Props) {
  const { creator, permissions } = project;

  const { sdks } = useSdkForLoggedIn();
  const onUpdatePermissions = (permissions: SdkPermissionT[]) => pipe(
    sdks.dashboard.projects.update({
      ...castSdkProjectToUpdateInput(project),
      permissions,
    }),
    tapTaskEither(onShared),
  );

  if (!permissions) {
    return null;
  }

  return (
    <div className="flex items-center gap-6">
      <PermissionAvatarsList permissions={permissions.current ?? []} />
      <ShareResourceButton
        creator={creator}
        defaultValue={permissions.current ?? []}
        onSubmit={onUpdatePermissions}
      />
    </div>
  );
}
