import {
  CancelButton,
  CreateButton,
  FormErrorAlert,
  Modal,
  type ModalProps,
  ModalTitle,
} from '@llm/ui';
import { useI18n } from '~/i18n';

import type { CreateUsersGroupValue } from './types';

import { UsersGroupSharedFormFields } from '../shared';
import { useUsersGroupCreateForm } from './use-users-group-create-form';

export type UsersGroupCreateFormModalProps =
  & Omit<ModalProps, 'children' | 'header' | 'formProps'>
  & {
    defaultValue: CreateUsersGroupValue;
    onAfterSubmit?: VoidFunction;
  };

export function UsersGroupCreateFormModal(
  {
    defaultValue,
    onAfterSubmit,
    onClose,
    ...props
  }: UsersGroupCreateFormModalProps,
) {
  const t = useI18n().pack.usersGroups.form;
  const { handleSubmitEvent, validator, submitState, bind } = useUsersGroupCreateForm({
    defaultValue,
    onAfterSubmit,
  });

  return (
    <Modal
      {...props}
      isOverflowVisible
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
      <UsersGroupSharedFormFields
        errors={validator.errors.all as any}
        {...bind.merged()}
      />

      <FormErrorAlert result={submitState.result} />
    </Modal>
  );
}
