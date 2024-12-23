import type { SdkUserT } from '@llm/sdk';

import {
  CancelButton,
  FormErrorAlert,
  Modal,
  type ModalProps,
  ModalTitle,
  UpdateButton,
} from '@llm/ui';
import { useI18n } from '~/i18n';

import { UserSharedFormFields } from '../shared';
import { UserOrganizationInfoField, UserUpdateAuthMethodsFormField } from './fields';
import { useUserUpdateForm } from './use-user-update-form';

export type UserUpdateFormModalProps =
  & Omit<ModalProps, 'children' | 'header' | 'formProps'>
  & {
    user: SdkUserT;
    onAfterSubmit?: VoidFunction;
  };

export function UserUpdateFormModal(
  {
    user,
    onAfterSubmit,
    onClose,
    ...props
  }: UserUpdateFormModalProps,
) {
  const t = useI18n().pack.modules.users.form;
  const { handleSubmitEvent, validator, submitState, bind } = useUserUpdateForm({
    defaultValue: {
      id: user.id,
      active: user.active,
      archiveProtection: user.archiveProtection,
      auth: user.auth,
      email: user.email,
    },
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
      {user.role === 'user' && (
        <UserOrganizationInfoField user={user} />
      )}

      <UserSharedFormFields
        errors={validator.errors.all as unknown as any}
        {...bind.merged()}
      />

      <UserUpdateAuthMethodsFormField
        {...validator.errors.extract('auth', { nested: true })}
        {...bind.path('auth')}
      />

      <FormErrorAlert result={submitState.result} />
    </Modal>
  );
}
