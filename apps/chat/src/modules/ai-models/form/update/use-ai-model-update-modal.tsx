import type { SdkAIModelT } from '@dashhub/sdk';

import { useAnimatedModal } from '@dashhub/commons-front';

import {
  AIModelUpdateFormModal,
  type AIModelUpdateFormModalProps,
} from './ai-model-update-form-modal';

type AIModelShowModalProps =
  & Pick<AIModelUpdateFormModalProps, 'onAfterSubmit'>
  & {
    app: SdkAIModelT;
  };

export function useAIModelUpdateModal() {
  return useAnimatedModal<boolean, AIModelShowModalProps>({
    renderModalContent: ({ showProps, hiding, onAnimatedClose }) => (
      <AIModelUpdateFormModal
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
