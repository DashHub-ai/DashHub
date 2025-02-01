import type { SdkCreateOrganizationInputT } from '@llm/sdk';

import { useAnimatedModal } from '@llm/commons-front';

import {
  OrganizationCreateFormModal,
  type OrganizationCreateFormModalProps,
} from './organization-create-form-modal';

type OrganizationShowModalProps =
  & Pick<OrganizationCreateFormModalProps, 'onAfterSubmit'>
  & {
    defaultValue: SdkCreateOrganizationInputT;
  };

export function useOrganizationCreateModal() {
  return useAnimatedModal<boolean, OrganizationShowModalProps>({
    renderModalContent: ({ showProps, hiding, onAnimatedClose }) => (
      <OrganizationCreateFormModal
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
