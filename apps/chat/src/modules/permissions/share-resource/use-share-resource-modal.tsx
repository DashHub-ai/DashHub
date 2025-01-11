import type { SdkPermissionT } from '@llm/sdk';

import { useAnimatedModal } from '@llm/commons-front';

import { ShareResourceFormModal } from './share-resource-form-modal';

type ProjectShowModalProps = {
  defaultValue: SdkPermissionT[];
};

export function useShareResourceModal() {
  return useAnimatedModal<SdkPermissionT[], ProjectShowModalProps>({
    renderModalContent: ({ showProps, hiding, onAnimatedClose }) => (
      <ShareResourceFormModal
        {...showProps}
        isLeaving={hiding}
        onSubmit={(value) => {
          void onAnimatedClose(value);
        }}
        onClose={() => {
          void onAnimatedClose();
        }}
      />
    ),
  });
}
