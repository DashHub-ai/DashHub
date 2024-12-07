import type { SdkCreateAppCategoryInputT } from '@llm/sdk';

import { useAnimatedModal } from '@llm/commons-front';

import {
  AppCategoryCreateFormModal,
  type AppCategoryCreateFormModalProps,
} from './app-category-create-form-modal';

type AppShowModalProps =
  & Pick<AppCategoryCreateFormModalProps, 'onAfterSubmit'>
  & {
    defaultValue: SdkCreateAppCategoryInputT;
  };

export function useAppCategoryCreateModal() {
  return useAnimatedModal<boolean, AppShowModalProps>({
    renderModalContent: ({ showProps, hiding, onAnimatedClose }) => (
      <AppCategoryCreateFormModal
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
