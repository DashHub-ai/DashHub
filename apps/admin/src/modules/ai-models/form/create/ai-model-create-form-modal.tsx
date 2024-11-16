import type { SdkCreateAIModelInputT } from '@llm/sdk';

import {
  CancelButton,
  CreateButton,
  FormErrorAlert,
  FormField,
  Modal,
  type ModalProps,
  ModalTitle,
} from '@llm/ui';
import { useI18n } from '~/i18n';
import { OrganizationsSearchSelect } from '~/modules/organizations/controls/organizations-search-select';

import { AIModelSharedFormFields } from '../shared';
import { useAIModelCreateForm } from './use-ai-model-create-form';

export type AIModelCreateFormModalProps =
  & Omit<ModalProps, 'children' | 'header' | 'formProps'>
  & {
    defaultValue: SdkCreateAIModelInputT;
    onAfterSubmit?: VoidFunction;
  };

export function AIModelCreateFormModal(
  {
    defaultValue,
    onAfterSubmit,
    onClose,
    ...props
  }: AIModelCreateFormModalProps,
) {
  const t = useI18n().pack.modules.aiModels.form;
  const { handleSubmitEvent, validator, submitState, bind } = useAIModelCreateForm({
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
      <FormField
        className="uk-margin"
        label={t.fields.organization.label}
        {...validator.errors.extract('organization')}
      >
        <OrganizationsSearchSelect {...bind.path('organization')} required />
      </FormField>

      <AIModelSharedFormFields
        errors={validator.errors.all as any}
        {...bind.merged()}
      />

      <FormErrorAlert result={submitState.result} />
    </Modal>
  );
}
