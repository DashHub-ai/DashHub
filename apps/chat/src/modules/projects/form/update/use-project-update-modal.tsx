import type { SdkProjectT } from '@dashhub/sdk';

import { useAnimatedModal } from '@dashhub/commons-front';

import {
  ProjectUpdateFormModal,
  type ProjectUpdateFormModalProps,
} from './project-update-form-modal';

type ProjectShowModalProps =
  & Pick<ProjectUpdateFormModalProps, 'onAfterSubmit'>
  & {
    project: SdkProjectT;
  };

export function useProjectUpdateModal() {
  return useAnimatedModal<boolean, ProjectShowModalProps>({
    renderModalContent: ({ showProps, hiding, onAnimatedClose }) => (
      <ProjectUpdateFormModal
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
