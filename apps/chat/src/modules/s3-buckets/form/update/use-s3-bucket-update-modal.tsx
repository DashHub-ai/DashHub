import type { SdkS3BucketT } from '@dashhub/sdk';

import { useAnimatedModal } from '@dashhub/commons-front';

import {
  S3BucketUpdateFormModal,
  type S3BucketUpdateFormModalProps,
} from './s3-bucket-update-form-modal';

type S3BucketShowModalProps =
  & Pick<S3BucketUpdateFormModalProps, 'onAfterSubmit'>
  & {
    project: SdkS3BucketT;
  };

export function useS3BucketUpdateModal() {
  return useAnimatedModal<boolean, S3BucketShowModalProps>({
    renderModalContent: ({ showProps, hiding, onAnimatedClose }) => (
      <S3BucketUpdateFormModal
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
