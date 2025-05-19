import type { SdkUsersGroupT } from '@dashhub/sdk';

import { useAnimatedModal } from '@dashhub/commons-front';

import {
  UsersGroupUpdateFormModal,
  type UsersGroupUpdateFormModalProps,
} from './users-group-update-form-modal';

type UsersGroupShowModalProps =
  & Pick<UsersGroupUpdateFormModalProps, 'onAfterSubmit'>
  & {
    usersGroup: SdkUsersGroupT;
  };

export function useUsersGroupUpdateModal() {
  return useAnimatedModal<boolean, UsersGroupShowModalProps>({
    renderModalContent: ({ showProps, hiding, onAnimatedClose }) => (
      <UsersGroupUpdateFormModal
        {...showProps}
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
