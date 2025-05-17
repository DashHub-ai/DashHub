import type { SdkS3BucketT } from '@dashhub/sdk';

import { useI18n } from '~/i18n';
import {
  CancelButton,
  FormErrorAlert,
  Modal,
  type ModalProps,
  ModalTitle,
  UpdateButton,
} from '~/ui';

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
  const t = useI18n().pack.s3Buckets.form;
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
      <S3BucketSharedFormFields
        errors={validator.errors.all as unknown as any}
        {...bind.merged()}
      />

      <FormErrorAlert result={submitState.result} />
    </Modal>
  );
}
