import type { SdkCreateUserInputT } from '@llm/sdk';

import { useAnimatedModal } from '@llm/commons-front';

import {
  UserCreateFormModal,
  type UserCreateFormModalProps,
} from './user-create-form-modal';

type UserShowModalProps =
  & Pick<UserCreateFormModalProps, 'onAfterSubmit'>
  & {
    defaultValue: SdkCreateUserInputT;
  };

export function useUserCreateModal() {
  return useAnimatedModal<boolean, UserShowModalProps>({
    renderModalContent: ({ showProps, hiding, onAnimatedClose }) => (
      <UserCreateFormModal
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
