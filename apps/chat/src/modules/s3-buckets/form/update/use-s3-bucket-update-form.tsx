import { type FormHookAttrs, useForm } from '@under-control/forms';
import { flow } from 'fp-ts/lib/function';

import { runTask, tapTaskEither } from '@llm/commons';
import {
  type SdkTableRowWithIdT,
  type SdkUpdateS3BucketInputT,
  useSdkForLoggedIn,
} from '@llm/sdk';
import { usePredefinedFormValidators } from '~/hooks';
import { useSaveTaskEitherNotification } from '~/ui';

type UpdateS3BucketFormHookAttrs =
  & Omit<
    FormHookAttrs<SdkUpdateS3BucketInputT & SdkTableRowWithIdT>,
    'validation' | 'onSubmit'
  >
  & {
    onAfterSubmit?: VoidFunction;
  };

export function useS3BucketUpdateForm(
  {
    onAfterSubmit,
    ...props
  }: UpdateS3BucketFormHookAttrs,
) {
  const { sdks } = useSdkForLoggedIn();
  const { required } = usePredefinedFormValidators<SdkUpdateS3BucketInputT & SdkTableRowWithIdT>();
  const saveNotifications = useSaveTaskEitherNotification();

  return useForm({
    resetAfterSubmit: false,
    onSubmit: flow(
      sdks.dashboard.s3Buckets.update,
      saveNotifications,
      tapTaskEither(() => onAfterSubmit?.()),
      runTask,
    ),
    validation: {
      mode: ['blur', 'submit'],
      validators: () => [
        required('name'),
        required('region'),
        required('accessKeyId'),
        required('secretAccessKey'),
      ],
    },
    ...props,
  });
}
