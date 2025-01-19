import type { SdkAIModelT } from '@llm/sdk';

import {
  CancelButton,
  FormErrorAlert,
  FormField,
  Modal,
  type ModalProps,
  ModalTitle,
  UpdateButton,
} from '@llm/ui';
import { useI18n } from '~/i18n';
import { OrganizationsSearchSelect } from '~/modules/organizations/controls/organizations-search-select';

import { AIModelSharedFormFields } from '../shared';
import { useAIModelUpdateForm } from './use-ai-model-update-form';

export type AIModelUpdateFormModalProps =
  & Omit<ModalProps, 'children' | 'header' | 'formProps'>
  & {
    app: SdkAIModelT;
    onAfterSubmit?: VoidFunction;
  };

export function AIModelUpdateFormModal(
  {
    app,
    onAfterSubmit,
    onClose,
    ...props
  }: AIModelUpdateFormModalProps,
) {
  const t = useI18n().pack.aiModels.form;
  const { handleSubmitEvent, validator, submitState, bind } = useAIModelUpdateForm({
    defaultValue: app,
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
      <FormField
        className="uk-margin"
        label={t.fields.organization.label}
      >
        <OrganizationsSearchSelect defaultValue={app.organization} required disabled />
      </FormField>

      <AIModelSharedFormFields
        errors={validator.errors.all as unknown as any}
        {...bind.merged()}
      />

      <FormErrorAlert result={submitState.result} />
    </Modal>
  );
}
