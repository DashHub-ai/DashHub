import { type FormHookAttrs, useForm } from '@under-control/forms';
import { flow } from 'fp-ts/lib/function';

import { runTask, tapTaskEither } from '@llm/commons';
import { type SdkTableRowWithIdT, type SdkUpdateUserInputT, useSdkForLoggedIn } from '@llm/sdk';
import { usePredefinedFormValidators, useSaveTaskEitherNotification } from '@llm/ui';

import { useUseAuthFormValidator } from '../shared';

type UpdateUserFormHookAttrs =
  & Omit<
    FormHookAttrs<SdkUpdateUserInputT & SdkTableRowWithIdT>,
    'validation' | 'onSubmit'
  >
  & {
    onAfterSubmit?: VoidFunction;
  };

export function useUserUpdateForm(
  {
    onAfterSubmit,
    ...props
  }: UpdateUserFormHookAttrs,
) {
  const { sdks } = useSdkForLoggedIn();
  const { emailFormatValidator } = usePredefinedFormValidators<SdkUpdateUserInputT & SdkTableRowWithIdT>();
  const saveNotifications = useSaveTaskEitherNotification();
  const authValidator = useUseAuthFormValidator<SdkUpdateUserInputT & SdkTableRowWithIdT>();

  return useForm({
    resetAfterSubmit: false,
    onSubmit: flow(
      sdks.dashboard.users.update,
      saveNotifications,
      tapTaskEither(() => onAfterSubmit?.()),
      runTask,
    ),
    validation: {
      mode: ['blur', 'submit'],
      validators: () => [
        emailFormatValidator('email'),
        authValidator('auth'),
      ],
    },
    ...props,
  });
}
