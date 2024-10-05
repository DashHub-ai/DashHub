import type { SdkCreateOrganizationInputT } from '@llm/sdk';

import {
  CancelButton,
  CreateButton,
  FormField,
  Input,
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
  const { handleSubmitEvent, validator, submitState, bind } = useOrganizationCreateForm({
    defaultValue,
    onAfterSubmit,
  });

  return (
    <Modal
      {...props}
      onClose={onClose}
      formProps={{
        onSubmit: handleSubmitEvent,
      }}
      header={(
        <ModalTitle>
          {t.title.create}
        </ModalTitle>
      )}
      footer={(
        <>
          <CancelButton disabled={submitState.loading} onClick={onClose} />
          <CreateButton disabled={submitState.loading} type="submit" />
        </>
      )}
    >
      <FormField
        label={t.fields.name.label}
        {...validator.errors.extract('name')}
      >
        <Input
          name="name"
          placeholder={t.fields.name.placeholder}
          required
          {...bind.path('name')}
        />
      </FormField>
    </Modal>
  );
}
