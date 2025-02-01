import type { SdkAppCategoryT } from '@llm/sdk';

import { useI18n } from '~/i18n';
import {
  CancelButton,
  FormErrorAlert,
  Modal,
  type ModalProps,
  ModalTitle,
  UpdateButton,
} from '~/ui';

import { AppCategorySharedFormFields } from '../shared';
import { useAppCategoryUpdateForm } from './use-app-category-update-form';

export type AppCategoryUpdateFormModalProps =
  & Omit<ModalProps, 'children' | 'header' | 'formProps'>
  & {
    category: SdkAppCategoryT;
    onAfterSubmit?: VoidFunction;
  };

export function AppCategoryUpdateFormModal(
  {
    category,
    onAfterSubmit,
    onClose,
    ...props
  }: AppCategoryUpdateFormModalProps,
) {
  const t = useI18n().pack.appsCategories.form;
  const { handleSubmitEvent, validator, submitState, bind } = useAppCategoryUpdateForm({
    defaultValue: category,
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
      <AppCategorySharedFormFields
        organization={category.organization}
        errors={validator.errors.all as unknown as any}
        excludeParentCategoriesIds={[category.id]}
        {...bind.merged()}
      />

      <FormErrorAlert result={submitState.result} />
    </Modal>
  );
}
