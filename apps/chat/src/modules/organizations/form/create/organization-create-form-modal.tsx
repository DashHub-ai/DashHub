import type { SdkCreateOrganizationInputT } from '@llm/sdk';

import { useI18n } from '~/i18n';
import {
  CancelButton,
  CreateButton,
  FormErrorAlert,
  Modal,
  type ModalProps,
  ModalTitle,
} from '~/ui';

import { OrganizationSharedFormFields } from '../shared';
import { useOrganizationCreateForm } from './use-organization-create-form';

export type OrganizationCreateFormModalProps =
  & Omit<ModalProps, 'children' | 'header' | 'formProps'>
  & {
    defaultValue: SdkCreateOrganizationInputT;
    onAfterSubmit?: VoidFunction;
  };

export function OrganizationCreateFormModal(
  {
    defaultValue,
    onAfterSubmit,
    onClose,
    ...props
  }: OrganizationCreateFormModalProps,
) {
  const t = useI18n().pack.organizations.form;
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
          <CreateButton loading={submitState.loading} type="submit" />
        </>
      )}
    >
      <OrganizationSharedFormFields
        errors={validator.errors.all as unknown as any}
        {...bind.merged()}
      />

      <FormErrorAlert result={submitState.result} />
    </Modal>
  );
}
