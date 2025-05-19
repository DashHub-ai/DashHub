import type { SdkAppT } from '@dashhub/sdk';

import { useAnimatedModal } from '@dashhub/commons-front';

import { ManageAppsCategoriesModal } from './manage-apps-categories-modal';

export function useManageAppsCategoriesModal() {
  return useAnimatedModal<SdkAppT>({
    renderModalContent: ({ hiding, onAnimatedClose }) => (
      <ManageAppsCategoriesModal
        isLeaving={hiding}
        onClose={() => {
          void onAnimatedClose();
        }}
      />
    ),
  });
}
