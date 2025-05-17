import type { SdkUserListItemT } from '@dashhub/sdk';

import { useAnimatedModal } from '@dashhub/commons-front';

import {
  ChooseUsersModal,
  type ChooseUsersModalProps,
} from './choose-users-modal';

type ChooseUsersShowModalProps = Omit<ChooseUsersModalProps, 'onSelected' | 'onClose'>;

export function useChooseUsersModal() {
  return useAnimatedModal<SdkUserListItemT[], ChooseUsersShowModalProps>({
    renderModalContent: ({ showProps, hiding, onAnimatedClose }) => (
      <ChooseUsersModal
        {...showProps}
        isLeaving={hiding}
        onSelected={(users) => {
          void onAnimatedClose(users);
        }}
        onClose={() => {
          void onAnimatedClose();
        }}
      />
    ),
  });
}
