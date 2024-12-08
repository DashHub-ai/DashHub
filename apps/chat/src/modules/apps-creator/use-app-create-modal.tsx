import type { SdkCreateAppInputT, SdkCreateAppOutputT } from '@llm/sdk';

import { useAnimatedModal } from '@llm/commons-front';

import { useWorkspaceOrganizationOrThrow } from '../workspace';
import { AppCreateFormModal } from './app-create-form-modal';

type AppShowModalProps = {
  defaultValue: Omit<SdkCreateAppInputT, 'organization'>;
};

export function useAppCreateModal() {
  const { assignWorkspaceOrganization } = useWorkspaceOrganizationOrThrow();

  return useAnimatedModal<SdkCreateAppOutputT, AppShowModalProps>({
    renderModalContent: ({ showProps: { defaultValue, ...showProps }, hiding, onAnimatedClose }) => (
      <AppCreateFormModal
        {...showProps}
        defaultValue={
          assignWorkspaceOrganization(defaultValue)
        }
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
