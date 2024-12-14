import type { SdkCreateProjectInputT } from '@llm/sdk';

import { useAnimatedModal } from '@llm/commons-front';
import { useWorkspaceOrganizationOrThrow } from '~/modules/workspace';

import {
  ProjectCreateFormModal,
  type ProjectCreateFormModalProps,
} from './project-create-form-modal';

type ProjectShowModalProps =
  & Pick<ProjectCreateFormModalProps, 'onAfterSubmit'>
  & {
    defaultValue: Omit<SdkCreateProjectInputT, 'organization'>;
  };

export function useProjectCreateModal() {
  const { assignWorkspaceOrganization } = useWorkspaceOrganizationOrThrow();

  return useAnimatedModal<boolean, ProjectShowModalProps>({
    renderModalContent: ({ showProps: { defaultValue, ...showProps }, hiding, onAnimatedClose }) => (
      <ProjectCreateFormModal
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
