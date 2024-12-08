import type { SdkCreateAppInputT, SdkCreateAppOutputT } from '@llm/sdk';

import {
  CancelButton,
  CreateButton,
  FormErrorAlert,
  Modal,
  type ModalProps,
  ModalTitle,
} from '@llm/ui';
import { useI18n } from '~/i18n';

import { AppSharedFormFields } from '../shared';
import { useAppCreateForm } from './use-app-create-form';

export type AppCreateFormModalProps =
  & Omit<ModalProps, 'children' | 'header' | 'formProps'>
  & {
    defaultValue: SdkCreateAppInputT;
    onAfterSubmit?: (result: SdkCreateAppOutputT) => void;
  };

export function AppCreateFormModal(
  {
    defaultValue,
    onAfterSubmit,
    onClose,
    ...props
  }: AppCreateFormModalProps,
) {
  const t = useI18n().pack.appsCreator;
  const { handleSubmitEvent, validator, submitState, bind, value } = useAppCreateForm({
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
          {t.create.title}
        </ModalTitle>
      )}
      footer={(
        <>
          <CancelButton disabled={submitState.loading} onClick={onClose} />
          <CreateButton loading={submitState.loading} type="submit" />
        </>
      )}
    >
      <AppSharedFormFields
        organization={value.organization}
        errors={validator.errors.all as any}
        {...bind.merged()}
      />

      <FormErrorAlert result={submitState.result} />
    </Modal>
  );
}
