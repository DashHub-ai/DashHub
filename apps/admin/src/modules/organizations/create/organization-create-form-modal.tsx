import type { SdkCreateOrganizationInputT } from '@llm/sdk';

import {
  CancelButton,
  CreateButton,
  Modal,
  type ModalProps,
  ModalTitle,
} from '~/components';
import { useI18n } from '~/i18n';

import { useOrganizationCreateForm } from './use-organization-create-form';

export type OrganizationFormModalProps = Omit<ModalProps, 'children' | 'header' | 'formProps'> & {
  defaultValue: SdkCreateOrganizationInputT;
  onAfterSubmit?: VoidFunction;
};

export function OrganizationFormModal(
  {
    defaultValue,
    onAfterSubmit,
    onClose,
    ...props
  }: OrganizationFormModalProps,
) {
  const t = useI18n().pack.modules.organizations.form;
  const form = useOrganizationCreateForm({
    defaultValue,
    onAfterSubmit,
  });

  return (
    <Modal
      {...props}
      onClose={onClose}
      formProps={{
        onSubmit: form.handleSubmitEvent,
      }}
      header={(
        <ModalTitle>
          {t.title.create}
        </ModalTitle>
      )}
      footer={(
        <>
          <CancelButton disabled={form.submitState.loading} onClick={onClose} />
          <CreateButton
            type="submit"
            disabled={form.submitState.loading}
          />
        </>
      )}
    >
      Modaaal
    </Modal>
  );
}
