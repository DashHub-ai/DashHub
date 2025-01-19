import type { SdkCreateAIModelInputT } from '@llm/sdk';

import { useAnimatedModal } from '@llm/commons-front';
import { useWorkspaceOrganizationOrThrow } from '~/modules/workspace';

import {
  AIModelCreateFormModal,
  type AIModelCreateFormModalProps,
} from './ai-model-create-form-modal';

type AIModelShowModalProps =
  & Pick<AIModelCreateFormModalProps, 'onAfterSubmit'>
  & {
    defaultValue: Omit<SdkCreateAIModelInputT, 'organization'>;
  };

export function useAIModelCreateModal() {
  const { assignWorkspaceOrganization } = useWorkspaceOrganizationOrThrow();

  return useAnimatedModal<boolean, AIModelShowModalProps>({
    renderModalContent: ({ showProps: { defaultValue, ...showProps }, hiding, onAnimatedClose }) => (
      <AIModelCreateFormModal
        {...showProps}
        defaultValue={
          assignWorkspaceOrganization(defaultValue)
        }
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
