import { useAnimatedModal } from '@llm/commons-front';

import type { CreateUserFormValue } from './types';

import {
  UserCreateFormModal,
  type UserCreateFormModalProps,
} from './user-create-form-modal';

type UserShowModalProps =
  & Pick<UserCreateFormModalProps, 'onAfterSubmit'>
  & {
    defaultValue: CreateUserFormValue;
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
