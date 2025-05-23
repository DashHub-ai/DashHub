import { useAnimatedModal } from '@dashhub/commons-front';
import { useWorkspaceOrganizationOrThrow } from '~/modules/workspace';

import type { CreateUsersGroupValue } from './types';

import {
  UsersGroupCreateFormModal,
  type UsersGroupCreateFormModalProps,
} from './users-group-create-form-modal';

type UsersGroupShowModalProps =
  & Pick<UsersGroupCreateFormModalProps, 'onAfterSubmit'>
  & {
    defaultValue: Omit<CreateUsersGroupValue, 'organization'>;
  };

export function useUsersGroupCreateModal() {
  const { assignWorkspaceOrganization } = useWorkspaceOrganizationOrThrow();

  return useAnimatedModal<boolean, UsersGroupShowModalProps>({
    renderModalContent: ({ showProps: { defaultValue, ...showProps }, hiding, onAnimatedClose }) => (
      <UsersGroupCreateFormModal
        {...showProps}
        defaultValue={
          assignWorkspaceOrganization(defaultValue)
        }
        isLeaving={hiding}
        onAfterSubmit={() => {
          void onAnimatedClose(true);
          showProps?.onAfterSubmit?.();
        }}
        onClose={() => {
          void onAnimatedClose();
        }}
      />
    ),
  });
}
