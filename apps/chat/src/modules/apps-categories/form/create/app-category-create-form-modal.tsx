import type { SdkCreateAppCategoryInputT } from '@llm/sdk';

import {
  CancelButton,
  CreateButton,
  FormErrorAlert,
  Modal,
  type ModalProps,
  ModalTitle,
} from '@llm/ui';
import { useI18n } from '~/i18n';

import { AppCategorySharedFormFields } from '../shared';
import { useAppCategoryCreateForm } from './use-app-category-create-form';

export type AppCategoryCreateFormModalProps =
  & Omit<ModalProps, 'children' | 'header' | 'formProps'>
  & {
    defaultValue: SdkCreateAppCategoryInputT;
    onAfterSubmit?: VoidFunction;
  };

export function AppCategoryCreateFormModal(
  {
    defaultValue,
    onAfterSubmit,
    onClose,
    ...props
  }: AppCategoryCreateFormModalProps,
) {
  const t = useI18n().pack.appsCategories.form;
  const { handleSubmitEvent, validator, submitState, bind, value } = useAppCategoryCreateForm({
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
      <AppCategorySharedFormFields
        errors={validator.errors.all as any}
        organization={value.organization}
        {...bind.merged()}
      />

      <FormErrorAlert result={submitState.result} />
    </Modal>
  );
}
