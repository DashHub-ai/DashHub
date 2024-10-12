import { type FormHookAttrs, useForm } from '@under-control/forms';
import { flow } from 'fp-ts/lib/function';

import { runTask, tapTaskEither } from '@llm/commons';
import { type SdkCreateS3BucketInputT, useSdkForLoggedIn } from '@llm/sdk';
import { useSaveTaskEitherNotification } from '~/components';
import { usePredefinedFormValidators } from '~/hooks';

type CreateS3BucketFormHookAttrs =
  & Omit<
    FormHookAttrs<SdkCreateS3BucketInputT>,
    'validation' | 'onSubmit'
  >
  & {
    onAfterSubmit?: VoidFunction;
  };

export function useS3BucketCreateForm(
  {
    onAfterSubmit,
    ...props
  }: CreateS3BucketFormHookAttrs,
) {
  const { sdks } = useSdkForLoggedIn();
  const { required, requiredListItem } = usePredefinedFormValidators<SdkCreateS3BucketInputT>();
  const saveNotifications = useSaveTaskEitherNotification();

  return useForm({
    resetAfterSubmit: false,
    onSubmit: flow(
      sdks.dashboard.s3Buckets.create,
      saveNotifications,
      tapTaskEither(() => onAfterSubmit?.()),
      runTask,
    ),
    validation: {
      mode: ['blur', 'submit'],
      validators: () => [
        required('name'),
        requiredListItem('organization'),
        required('region'),
        required('accessKeyId'),
        required('secretAccessKey'),
      ],
    },
    ...props,
  });
}
