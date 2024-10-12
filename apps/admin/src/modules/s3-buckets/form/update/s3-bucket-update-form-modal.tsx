import type { SdkS3BucketT } from '@llm/sdk';

import {
  CancelButton,
  FormErrorAlert,
  FormField,
  Modal,
  type ModalProps,
  ModalTitle,
  UpdateButton,
} from '~/components';
import { useI18n } from '~/i18n';
import { OrganizationsSearchSelect } from '~/modules/organizations/controls/organizations-search-select';

import { S3BucketSharedFormFields } from '../shared';
import { useS3BucketUpdateForm } from './use-s3-bucket-update-form';

export type S3BucketUpdateFormModalProps =
  & Omit<ModalProps, 'children' | 'header' | 'formProps'>
  & {
    project: SdkS3BucketT;
    onAfterSubmit?: VoidFunction;
  };

export function S3BucketUpdateFormModal(
  {
    project,
    onAfterSubmit,
    onClose,
    ...props
  }: S3BucketUpdateFormModalProps,
) {
  const t = useI18n().pack.modules.s3Buckets.form;
  const { handleSubmitEvent, validator, submitState, bind } = useS3BucketUpdateForm({
    defaultValue: project,
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

      <S3BucketSharedFormFields
        errors={validator.errors.all as unknown as any}
        {...bind.merged()}
      />

      <FormErrorAlert result={submitState.result} />
    </Modal>
  );
}
