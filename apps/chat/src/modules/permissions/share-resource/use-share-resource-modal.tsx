import type { SdkPermissionT, SdkUserListItemT } from '@dashhub/sdk';

import { useAnimatedModal } from '@dashhub/commons-front';

import { ShareResourceFormModal } from './share-resource-form-modal';

type ProjectShowModalProps = {
  defaultValue: SdkPermissionT[];
  creator: SdkUserListItemT;
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
