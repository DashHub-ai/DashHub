import type { SdkCreateUserInputT } from '@llm/sdk';

import {
  CancelButton,
  CreateButton,
  FormErrorAlert,
  FormField,
  Modal,
  type ModalProps,
  ModalTitle,
} from '~/components';
import { useI18n } from '~/i18n';

import { UserRoleSelect, UserSharedFormFields } from '../shared';
import { UserCreateAuthMethodsFormField } from './fields';
import { useUserCreateForm } from './use-user-create-form';

export type UserCreateFormModalProps =
  & Omit<ModalProps, 'children' | 'header' | 'formProps'>
  & {
    defaultValue: SdkCreateUserInputT;
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
  const t = useI18n().pack.modules.users.form;
  const { handleSubmitEvent, validator, submitState, bind } = useUserCreateForm({
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
      <FormField
        className="uk-margin"
        label={t.fields.role.label}
        {...validator.errors.extract('role')}
      >
        <UserRoleSelect {...bind.path('role')} />
      </FormField>

      <UserSharedFormFields
        errors={validator.errors.all as unknown as any}
        {...bind.merged()}
      />

      <UserCreateAuthMethodsFormField
        {...validator.errors.extract('auth', { nested: true })}
        {...bind.path('auth')}
      />

      <FormErrorAlert result={submitState.result} />
    </Modal>
  );
}
