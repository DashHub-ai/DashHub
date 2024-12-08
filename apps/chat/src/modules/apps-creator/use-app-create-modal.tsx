import type { SdkCreateAppInputT, SdkCreateAppOutputT } from '@llm/sdk';

import { useAnimatedModal } from '@llm/commons-front';

import { AppCreateFormModal } from './app-create-form-modal';

type AppShowModalProps = {
  defaultValue: SdkCreateAppInputT;
};

export function useAppCreateModal() {
  return useAnimatedModal<SdkCreateAppOutputT, AppShowModalProps>({
    renderModalContent: ({ showProps, hiding, onAnimatedClose }) => (
      <AppCreateFormModal
        {...showProps}
        isLeaving={hiding}
        onAfterSubmit={(result) => {
          void onAnimatedClose(result);
        }}
        onClose={() => {
          void onAnimatedClose();
        }}
      />
    ),
  });
}
