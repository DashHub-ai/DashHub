import { useI18n } from '~/i18n';
import {
  CancelButton,
  CreateButton,
  FormErrorAlert,
  Modal,
  type ModalProps,
  ModalTitle,
} from '~/ui';

import type {
  CreateUserFormValue,
} from './types';

import { UserAISettingsFormField, UserSharedFormFields } from '../shared';
import { UserCreateAuthMethodsFormField, UserOrganizationSettingsFormField } from './fields';
import { useUserCreateForm } from './use-user-create-form';

export type UserCreateFormModalProps =
  & Omit<ModalProps, 'children' | 'header' | 'formProps'>
  & {
    defaultValue: CreateUserFormValue;
    onAfterSubmit?: VoidFunction;
  };

export function UserCreateFormModal(
  {
    defaultValue,
    onAfterSubmit,
    onClose,
    ...props
  }: UserCreateFormModalProps,
) {
  const t = useI18n().pack.users.form;
  const { handleSubmitEvent, validator, submitState, bind, value } = useUserCreateForm({
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
      {value.role === 'user' && (
        <UserOrganizationSettingsFormField
          {...validator.errors.extract('organization', { nested: true })}
          {...bind.path('organization')}
        />
      )}

      <UserSharedFormFields
        errors={validator.errors.all as unknown as any}
        {...bind.merged()}
      />

      <UserAISettingsFormField
        {...validator.errors.extract('aiSettings', { nested: true })}
        {...bind.path('aiSettings')}
      />

      <UserCreateAuthMethodsFormField
        {...validator.errors.extract('auth', { nested: true })}
        {...bind.path('auth')}
      />

      <FormErrorAlert result={submitState.result} />
    </Modal>
  );
}
