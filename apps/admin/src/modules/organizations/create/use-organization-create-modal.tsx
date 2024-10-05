import type { SdkCreateOrganizationInputT } from '@llm/sdk';

import { useAnimatedModal } from '@llm/commons-front';

import { OrganizationFormModal, type OrganizationFormModalProps } from './organization-create-form-modal';

type OrganizationShowModalProps =
  & Pick<OrganizationFormModalProps, 'onAfterSubmit'>
  & {
    defaultValue: SdkCreateOrganizationInputT;
  };

export function useOrganizationCreateModal() {
  return useAnimatedModal<boolean, OrganizationShowModalProps>({
    renderModalContent: ({ showProps, hiding, onAnimatedClose }) => (
      <OrganizationFormModal
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
