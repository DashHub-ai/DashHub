import { castSdkProjectToUpdateInput, type SdkProjectT } from '@llm/sdk';
import { useI18n } from '~/i18n';
import {
  CancelButton,
  FormErrorAlert,
  Modal,
  type ModalProps,
  ModalTitle,
  UpdateButton,
} from '~/ui';

import { ProjectSharedFormFields } from '../shared';
import { useProjectUpdateForm } from './use-project-update-form';

export type ProjectUpdateFormModalProps =
  & Omit<ModalProps, 'children' | 'header' | 'formProps'>
  & {
    project: SdkProjectT;
    onAfterSubmit?: VoidFunction;
  };

export function ProjectUpdateFormModal(
  {
    project,
    onAfterSubmit,
    onClose,
    ...props
  }: ProjectUpdateFormModalProps,
) {
  const t = useI18n().pack.projects.form;
  const { handleSubmitEvent, validator, submitState, bind } = useProjectUpdateForm({
    defaultValue: {
      ...castSdkProjectToUpdateInput(project),
      permissions: project.permissions?.current,
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
      <ProjectSharedFormFields
        errors={validator.errors.all as unknown as any}
        {...bind.merged()}
      />

      <FormErrorAlert result={submitState.result} />
    </Modal>
  );
}
