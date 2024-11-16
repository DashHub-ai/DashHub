import type { SdkCreateAIModelInputT } from '@llm/sdk';

import { useAnimatedModal } from '@llm/commons-front';

import {
  AIModelCreateFormModal,
  type AIModelCreateFormModalProps,
} from './ai-model-create-form-modal';

type AIModelShowModalProps =
  & Pick<AIModelCreateFormModalProps, 'onAfterSubmit'>
  & {
    defaultValue: SdkCreateAIModelInputT;
  };

export function useAIModelCreateModal() {
  return useAnimatedModal<boolean, AIModelShowModalProps>({
    renderModalContent: ({ showProps, hiding, onAnimatedClose }) => (
      <AIModelCreateFormModal
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
