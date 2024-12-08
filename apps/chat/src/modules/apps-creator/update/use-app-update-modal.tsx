import type { SdkAppT } from '@llm/sdk';

import { useAnimatedModal } from '@llm/commons-front';

import {
  AppUpdateFormModal,
  type AppUpdateFormModalProps,
} from './app-update-form-modal';

type AppShowModalProps =
  & Pick<AppUpdateFormModalProps, 'onAfterSubmit'>
  & {
    app: SdkAppT;
  };

export function useAppUpdateModal() {
  return useAnimatedModal<boolean, AppShowModalProps>({
    renderModalContent: ({ showProps, hiding, onAnimatedClose }) => (
      <AppUpdateFormModal
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
