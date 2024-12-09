import type { SdkCreateAppCategoryInputT } from '@llm/sdk';

import { useAnimatedModal } from '@llm/commons-front';
import { useWorkspaceOrganizationOrThrow } from '~/modules/workspace';

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
  const { assignWorkspaceOrganization } = useWorkspaceOrganizationOrThrow();

  return useAnimatedModal<boolean, AppShowModalProps>({
    renderModalContent: ({ showProps: { defaultValue, ...showProps }, hiding, onAnimatedClose }) => (
      <AppCategoryCreateFormModal
        {...showProps}
        isLeaving={hiding}
        defaultValue={assignWorkspaceOrganization(defaultValue)}
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
