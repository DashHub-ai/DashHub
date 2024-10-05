import type { SdkTableRowWithIdT, SdkUpdateOrganizationInputT } from '@llm/sdk';

import {
  CancelButton,
  FormErrorAlert,
  FormField,
  Input,
  Modal,
  type ModalProps,
  ModalTitle,
  UpdateButton,
} from '~/components';
import { useI18n } from '~/i18n';

import { useOrganizationUpdateForm } from './use-organization-update-form';

export type OrganizationUpdateFormModalProps =
  & Omit<ModalProps, 'children' | 'header' | 'formProps'>
  & {
    defaultValue: SdkUpdateOrganizationInputT & SdkTableRowWithIdT;
    onAfterSubmit?: VoidFunction;
  };

export function OrganizationUpdateFormModal(
  {
    defaultValue,
    onAfterSubmit,
    onClose,
    ...props
  }: OrganizationUpdateFormModalProps,
) {
  const t = useI18n().pack.modules.organizations.form;
  const { handleSubmitEvent, validator, submitState, bind } = useOrganizationUpdateForm({
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
          {t.title.edit}
        </ModalTitle>
      )}
      footer={(
        <>
          <CancelButton disabled={submitState.loading} onClick={onClose} />
          <UpdateButton loading={submitState.loading} type="submit" />
        </>
      )}
    >
      <FormField
        className="uk-margin"
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

      <FormErrorAlert result={submitState.result} />
    </Modal>
  );
}
