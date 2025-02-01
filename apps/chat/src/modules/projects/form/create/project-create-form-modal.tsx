import type { SdkCreateProjectInputT } from '@llm/sdk';

import { useI18n } from '~/i18n';
import {
  CancelButton,
  CreateButton,
  FormErrorAlert,
  Modal,
  type ModalProps,
  ModalTitle,
} from '~/ui';

import { ProjectSharedFormFields } from '../shared';
import { useProjectCreateForm } from './use-project-create-form';

export type ProjectCreateFormModalProps =
  & Omit<ModalProps, 'children' | 'header' | 'formProps'>
  & {
    defaultValue: SdkCreateProjectInputT;
    onAfterSubmit?: VoidFunction;
  };

export function ProjectCreateFormModal(
  {
    defaultValue,
    onAfterSubmit,
    onClose,
    ...props
  }: ProjectCreateFormModalProps,
) {
  const t = useI18n().pack.projects.form;
  const { handleSubmitEvent, validator, submitState, bind } = useProjectCreateForm({
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
      <ProjectSharedFormFields
        errors={validator.errors.all as any}
        {...bind.merged()}
      />

      <FormErrorAlert result={submitState.result} />
    </Modal>
  );
}
