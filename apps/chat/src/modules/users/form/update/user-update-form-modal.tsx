import { useMemo } from 'react';

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

import type { UpdateUserFormValue } from './types';

import { UserSharedFormFields } from '../shared';
import { UserOrganizationSettingsFormField, UserUpdateAuthMethodsFormField } from './fields';
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
  const t = useI18n().pack.users.form;

  const defaultValue = useMemo<UpdateUserFormValue>(() => {
    const attrs = {
      id: user.id,
      active: user.active,
      archiveProtection: user.archiveProtection,
      auth: user.auth,
      email: user.email,
    };

    return (
      user.role === 'user'
        ? {
            ...attrs,
            role: 'user',
            organization: user.organization,
          }
        : {
            ...attrs,
            role: 'root',
          }
    );
  }, [user]);

  const { handleSubmitEvent, validator, submitState, bind, value } = useUserUpdateForm({
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

      <UserUpdateAuthMethodsFormField
        {...validator.errors.extract('auth', { nested: true })}
        {...bind.path('auth')}
      />

      <FormErrorAlert result={submitState.result} />
    </Modal>
  );
}
