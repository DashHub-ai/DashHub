import type { SdkUsersGroupT } from '@llm/sdk';

import {
  CancelButton,
  FormErrorAlert,
  Modal,
  type ModalProps,
  ModalTitle,
  UpdateButton,
} from '@llm/ui';
import { useI18n } from '~/i18n';

import { UsersGroupSharedFormFields } from '../shared';
import { useUsersGroupUpdateForm } from './use-users-group-update-form';

export type UsersGroupUpdateFormModalProps =
  & Omit<ModalProps, 'children' | 'header' | 'formProps'>
  & {
    usersGroup: SdkUsersGroupT;
    onAfterSubmit?: VoidFunction;
  };

export function UsersGroupUpdateFormModal(
  {
    usersGroup,
    onAfterSubmit,
    onClose,
    ...props
  }: UsersGroupUpdateFormModalProps,
) {
  const t = useI18n().pack.usersGroups.form;
  const { handleSubmitEvent, validator, submitState, bind } = useUsersGroupUpdateForm({
    defaultValue: usersGroup,
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
      <UsersGroupSharedFormFields
        errors={validator.errors.all as unknown as any}
        {...bind.merged()}
      />

      <FormErrorAlert result={submitState.result} />
    </Modal>
  );
}
