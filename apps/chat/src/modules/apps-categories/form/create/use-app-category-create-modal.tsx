import type { SdkCreateAppCategoryInputT } from '@dashhub/sdk';

import { useAnimatedModal } from '@dashhub/commons-front';
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
