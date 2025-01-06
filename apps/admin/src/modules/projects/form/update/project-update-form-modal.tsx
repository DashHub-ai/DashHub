import type { SdkProjectT } from '@llm/sdk';

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
  const t = useI18n().pack.modules.projects.form;
  const { handleSubmitEvent, validator, submitState, bind } = useProjectUpdateForm({
    defaultValue: {
      ...project,
      permissions: project.permissions?.current,
      summary: {
        content: (
          project.summary.content.generated
            ? { generated: true, value: null }
            : { generated: false, value: project.summary.content.value! }
        ),
      },
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
      <FormField
        className="uk-margin"
        label={t.fields.organization.label}
      >
        <OrganizationsSearchSelect defaultValue={project.organization} required disabled />
      </FormField>

      <ProjectSharedFormFields
        errors={validator.errors.all as unknown as any}
        {...bind.merged()}
      />

      <FormErrorAlert result={submitState.result} />
    </Modal>
  );
}
