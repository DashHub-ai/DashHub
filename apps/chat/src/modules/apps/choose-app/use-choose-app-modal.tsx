import type { SdkAppT } from '@llm/sdk';

import { useAnimatedModal } from '@llm/commons-front';

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
