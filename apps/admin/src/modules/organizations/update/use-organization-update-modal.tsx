import type { SdkTableRowWithIdT, SdkUpdateOrganizationInputT } from '@llm/sdk';

import { useAnimatedModal } from '@llm/commons-front';

import {
  OrganizationUpdateFormModal,
  type OrganizationUpdateFormModalProps,
} from './organization-update-form-modal';

type OrganizationShowModalProps =
  & Pick<OrganizationUpdateFormModalProps, 'onAfterSubmit'>
  & {
    defaultValue: SdkUpdateOrganizationInputT & SdkTableRowWithIdT;
  };

export function useOrganizationUpdateModal() {
  return useAnimatedModal<boolean, OrganizationShowModalProps>({
    renderModalContent: ({ showProps, hiding, onAnimatedClose }) => (
      <OrganizationUpdateFormModal
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
