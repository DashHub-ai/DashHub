import type { SdkAppT } from '@llm/sdk';

import {
  CancelButton,
  FormErrorAlert,
  Modal,
  type ModalProps,
  ModalTitle,
  UpdateButton,
} from '@llm/ui';
import { useI18n } from '~/i18n';

import { AppSharedFormFields } from '../shared';
import { useAppUpdateForm } from './use-app-update-form';

export type AppUpdateFormModalProps =
  & Omit<ModalProps, 'children' | 'header' | 'formProps'>
  & {
    app: SdkAppT;
    onAfterSubmit?: VoidFunction;
  };

export function AppUpdateFormModal(
  {
    app,
    onAfterSubmit,
    onClose,
    ...props
  }: AppUpdateFormModalProps,
) {
  const t = useI18n().pack.appsCreator.edit;
  const { handleSubmitEvent, validator, submitState, bind } = useAppUpdateForm({
    defaultValue: {
      ...app,
      permissions: app.permissions?.current,
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
          {t.title}
        </ModalTitle>
      )}
      footer={(
        <>
          <CancelButton disabled={submitState.loading} onClick={onClose} />
          <UpdateButton loading={submitState.loading} type="submit" />
        </>
      )}
    >
      <AppSharedFormFields
        organization={app.organization}
        errors={validator.errors.all as unknown as any}
        {...bind.merged()}
      />

      <FormErrorAlert result={submitState.result} />
    </Modal>
  );
}
