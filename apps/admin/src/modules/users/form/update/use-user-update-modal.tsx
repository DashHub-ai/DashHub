import type { SdkTableRowWithIdT, SdkUpdateUserInputT } from '@llm/sdk';

import { useAnimatedModal } from '@llm/commons-front';

import {
  UserUpdateFormModal,
  type UserUpdateFormModalProps,
} from './user-update-form-modal';

type UserShowModalProps =
  & Pick<UserUpdateFormModalProps, 'onAfterSubmit'>
  & {
    defaultValue: SdkUpdateUserInputT & SdkTableRowWithIdT;
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
