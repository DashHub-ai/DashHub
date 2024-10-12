import type { SdkCreateProjectInputT } from '@llm/sdk';

import { useAnimatedModal } from '@llm/commons-front';

import {
  ProjectCreateFormModal,
  type ProjectCreateFormModalProps,
} from './project-create-form-modal';

type ProjectShowModalProps =
  & Pick<ProjectCreateFormModalProps, 'onAfterSubmit'>
  & {
    defaultValue: SdkCreateProjectInputT;
  };

export function useProjectCreateModal() {
  return useAnimatedModal<boolean, ProjectShowModalProps>({
    renderModalContent: ({ showProps, hiding, onAnimatedClose }) => (
      <ProjectCreateFormModal
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
