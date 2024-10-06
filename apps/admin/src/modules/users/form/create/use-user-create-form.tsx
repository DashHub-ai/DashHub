import { type FormHookAttrs, useForm } from '@under-control/forms';
import { flow } from 'fp-ts/lib/function';

import { runTask, tapTaskEither } from '@llm/commons';
import { type SdkCreateUserInputT, useSdkForLoggedIn } from '@llm/sdk';
import { useSaveTaskEitherNotification } from '~/components';
import { usePredefinedFormValidators } from '~/hooks';

type CreateUserFormHookAttrs =
  & Omit<
    FormHookAttrs<SdkCreateUserInputT>,
    'validation' | 'onSubmit'
  >
  & {
    onAfterSubmit?: VoidFunction;
  };

export function useUserCreateForm(
  {
    onAfterSubmit,
    ...props
  }: CreateUserFormHookAttrs,
) {
  const { sdks } = useSdkForLoggedIn();
  const { emailFormatValidator } = usePredefinedFormValidators<SdkCreateUserInputT>();
  const saveNotifications = useSaveTaskEitherNotification();

  return useForm({
    resetAfterSubmit: false,
    onSubmit: flow(
      sdks.dashboard.users.create,
      saveNotifications,
      tapTaskEither(() => onAfterSubmit?.()),
      runTask,
    ),
    validation: {
      mode: ['blur', 'submit'],
      validators: () => [
        emailFormatValidator('email'),
      ],
    },
    ...props,
  });
}
