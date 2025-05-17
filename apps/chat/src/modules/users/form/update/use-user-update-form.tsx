import { type FormHookAttrs, useForm } from '@under-control/forms';
import { flow } from 'fp-ts/lib/function';

import { runTask, tapTaskEither } from '@dashhub/commons';
import { useSdkForLoggedIn } from '@dashhub/sdk';
import { usePredefinedFormValidators } from '~/hooks';
import { useSaveTaskEitherNotification } from '~/ui';

import type { UpdateUserFormValue } from './types';

import { useUseAuthFormValidator } from '../shared';

type UpdateUserFormHookAttrs =
  & Omit<
    FormHookAttrs<UpdateUserFormValue>,
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
  const { emailFormatValidator, required } = usePredefinedFormValidators<UpdateUserFormValue>();
  const saveNotifications = useSaveTaskEitherNotification();
  const authValidator = useUseAuthFormValidator<UpdateUserFormValue>();

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
        required('name'),
        emailFormatValidator('email'),
        authValidator('auth'),
      ],
    },
    ...props,
  });
}
