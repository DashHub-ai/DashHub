import type { SdkCreateAppInputT } from '@llm/sdk';

import { useAnimatedModal } from '@llm/commons-front';

import {
  AppCreateFormModal,
  type AppCreateFormModalProps,
} from './app-create-form-modal';

type AppShowModalProps =
  & Pick<AppCreateFormModalProps, 'onAfterSubmit'>
  & {
    defaultValue: SdkCreateAppInputT;
  };

export function useAppCreateModal() {
  return useAnimatedModal<boolean, AppShowModalProps>({
    renderModalContent: ({ showProps, hiding, onAnimatedClose }) => (
      <AppCreateFormModal
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
