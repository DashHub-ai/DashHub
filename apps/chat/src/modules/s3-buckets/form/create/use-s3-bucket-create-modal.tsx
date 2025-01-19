import type { SdkCreateS3BucketInputT } from '@llm/sdk';

import { useAnimatedModal } from '@llm/commons-front';
import { useWorkspaceOrganizationOrThrow } from '~/modules/workspace';

import {
  S3BucketCreateFormModal,
  type S3BucketCreateFormModalProps,
} from './s3-bucket-create-form-modal';

type S3BucketShowModalProps =
  & Pick<S3BucketCreateFormModalProps, 'onAfterSubmit'>
  & {
    defaultValue: Omit<SdkCreateS3BucketInputT, 'organization'>;
  };

export function useS3BucketCreateModal() {
  const { assignWorkspaceOrganization } = useWorkspaceOrganizationOrThrow();

  return useAnimatedModal<boolean, S3BucketShowModalProps>({
    renderModalContent: ({ showProps: { defaultValue, ...showProps }, hiding, onAnimatedClose }) => (
      <S3BucketCreateFormModal
        {...showProps}
        defaultValue={
          assignWorkspaceOrganization(defaultValue)
        }
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
