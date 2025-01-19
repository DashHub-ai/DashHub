import type { SdkCreateS3BucketInputT } from '@llm/sdk';

import {
  CancelButton,
  CreateButton,
  FormErrorAlert,
  Modal,
  type ModalProps,
  ModalTitle,
} from '@llm/ui';
import { useI18n } from '~/i18n';

import { S3BucketSharedFormFields } from '../shared';
import { useS3BucketCreateForm } from './use-s3-bucket-create-form';

export type S3BucketCreateFormModalProps =
  & Omit<ModalProps, 'children' | 'header' | 'formProps'>
  & {
    defaultValue: SdkCreateS3BucketInputT;
    onAfterSubmit?: VoidFunction;
  };

export function S3BucketCreateFormModal(
  {
    defaultValue,
    onAfterSubmit,
    onClose,
    ...props
  }: S3BucketCreateFormModalProps,
) {
  const t = useI18n().pack.s3Buckets.form;
  const { handleSubmitEvent, validator, submitState, bind } = useS3BucketCreateForm({
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
      <S3BucketSharedFormFields
        errors={validator.errors.all as any}
        {...bind.merged()}
      />

      <FormErrorAlert result={submitState.result} />
    </Modal>
  );
}
