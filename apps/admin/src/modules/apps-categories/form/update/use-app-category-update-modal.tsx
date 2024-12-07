import type { SdkAppCategoryT } from '@llm/sdk';

import { useAnimatedModal } from '@llm/commons-front';

import {
  AppCategoryUpdateFormModal,
  type AppCategoryUpdateFormModalProps,
} from './app-category-update-form-modal';

type AppCategoryShowModalProps =
  & Pick<AppCategoryUpdateFormModalProps, 'onAfterSubmit'>
  & {
    category: SdkAppCategoryT;
  };

export function useAppCategoryUpdateModal() {
  return useAnimatedModal<boolean, AppCategoryShowModalProps>({
    renderModalContent: ({ showProps, hiding, onAnimatedClose }) => (
      <AppCategoryUpdateFormModal
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
