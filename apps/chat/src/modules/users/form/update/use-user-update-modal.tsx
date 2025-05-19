import type { SdkUserT } from '@dashhub/sdk';

import { useAnimatedModal } from '@dashhub/commons-front';

import {
  UserUpdateFormModal,
  type UserUpdateFormModalProps,
} from './user-update-form-modal';

type UserShowModalProps =
  & Pick<UserUpdateFormModalProps, 'onAfterSubmit'>
  & {
    user: SdkUserT;
  };

export function useUserUpdateModal() {
  return useAnimatedModal<boolean, UserShowModalProps>({
    renderModalContent: ({ showProps, hiding, onAnimatedClose }) => (
      <UserUpdateFormModal
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
