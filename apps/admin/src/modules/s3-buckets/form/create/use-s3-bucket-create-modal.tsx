import type { SdkCreateS3BucketInputT } from '@llm/sdk';

import { useAnimatedModal } from '@llm/commons-front';

import {
  S3BucketCreateFormModal,
  type S3BucketCreateFormModalProps,
} from './s3-bucket-create-form-modal';

type S3BucketShowModalProps =
  & Pick<S3BucketCreateFormModalProps, 'onAfterSubmit'>
  & {
    defaultValue: SdkCreateS3BucketInputT;
  };

export function useS3BucketCreateModal() {
  return useAnimatedModal<boolean, S3BucketShowModalProps>({
    renderModalContent: ({ showProps, hiding, onAnimatedClose }) => (
      <S3BucketCreateFormModal
        {...showProps}
        isLeaving={hiding}
        onAfterSubmit={() => {
          void onAnimatedClose(true);
          showProps?.onAfterSubmit?.();
        }}
        onClose={() => {
          void onAnimatedClose();
        }}
      />
    ),
  });
}
