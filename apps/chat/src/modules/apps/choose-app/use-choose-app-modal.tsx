import type { SdkAppT } from '@dashhub/sdk';

import { useAnimatedModal } from '@dashhub/commons-front';

import {
  ChooseAppModal,
  type ChooseAppModalProps,
} from './choose-app-modal';

type AppShowModalProps = Omit<ChooseAppModalProps, 'onSelect' | 'onClose'>;

export function useChooseAppModal() {
  return useAnimatedModal<SdkAppT, AppShowModalProps>({
    renderModalContent: ({ showProps, hiding, onAnimatedClose }) => (
      <ChooseAppModal
        {...showProps}
        isLeaving={hiding}
        onSelect={(value) => {
          void onAnimatedClose(value);
        }}
        onClose={() => {
          void onAnimatedClose();
        }}
      />
    ),
  });
}
