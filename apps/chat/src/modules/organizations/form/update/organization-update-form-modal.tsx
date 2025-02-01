import type { SdkTableRowWithIdT, SdkUpdateOrganizationInputT } from '@llm/sdk';

import {
  CancelButton,
  FormErrorAlert,
  Modal,
  type ModalProps,
  ModalTitle,
  UpdateButton,
} from '@llm/ui';
import { useI18n } from '~/i18n';

import { OrganizationSharedFormFields } from '../shared';
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
  const t = useI18n().pack.organizations.form;
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
      <OrganizationSharedFormFields
        errors={validator.errors.all as unknown as any}
        {...bind.merged()}
      />

      <FormErrorAlert result={submitState.result} />
    </Modal>
  );
}
