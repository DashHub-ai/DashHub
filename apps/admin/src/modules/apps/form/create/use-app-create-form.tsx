import { type FormHookAttrs, useForm } from '@under-control/forms';
import { flow } from 'fp-ts/lib/function';

import { runTask, tapTaskEither } from '@llm/commons';
import { type SdkCreateAppInputT, useSdkForLoggedIn } from '@llm/sdk';
import { useSaveTaskEitherNotification } from '~/components';
import { usePredefinedFormValidators } from '~/hooks';

type CreateAppFormHookAttrs =
  & Omit<
    FormHookAttrs<SdkCreateAppInputT>,
    'validation' | 'onSubmit'
  >
  & {
    onAfterSubmit?: VoidFunction;
  };

export function useAppCreateForm(
  {
    onAfterSubmit,
    ...props
  }: CreateAppFormHookAttrs,
) {
  const { sdks } = useSdkForLoggedIn();
  const { required, requiredListItem } = usePredefinedFormValidators<SdkCreateAppInputT>();
  const saveNotifications = useSaveTaskEitherNotification();

  return useForm({
    resetAfterSubmit: false,
    onSubmit: flow(
      sdks.dashboard.apps.create,
      saveNotifications,
      tapTaskEither(() => onAfterSubmit?.()),
      runTask,
    ),
    validation: {
      mode: ['blur', 'submit'],
      validators: () => [
        required('name'),
        required('chatContext'),
        requiredListItem('organization'),
      ],
    },
    ...props,
  });
}
