import type { SdkAppT } from '@llm/sdk';

import { useAnimatedModal } from '@llm/commons-front';

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
