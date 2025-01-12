import type { SdkCreateAppOutputT } from '@llm/sdk';

import { useAnimatedModal } from '@llm/commons-front';

import type { CreateAppFormValue } from './use-app-create-form';

import { useWorkspaceOrganizationOrThrow } from '../../workspace';
import { AppCreateFormModal } from './app-create-form-modal';

type AppShowModalProps = {
  defaultValue: Omit<CreateAppFormValue, 'organization'>;
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
