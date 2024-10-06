import { type FormHookAttrs, useForm } from '@under-control/forms';
import { flow } from 'fp-ts/lib/function';

import { runTask, tapTaskEither } from '@llm/commons';
import { useSdkForLoggedIn } from '@llm/sdk';
import { useSaveTaskEitherNotification } from '~/components';
import { usePredefinedFormValidators } from '~/hooks';

import type { CreateUserFormValue } from './types';

import { useUseAuthFormValidator } from '../shared';

type CreateUserFormHookAttrs =
  & Omit<
    FormHookAttrs<CreateUserFormValue>,
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
  const { emailFormatValidator } = usePredefinedFormValidators<CreateUserFormValue>();
  const saveNotifications = useSaveTaskEitherNotification();
  const authValidator = useUseAuthFormValidator<CreateUserFormValue>();

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
        authValidator('auth'),
      ],
    },
    ...props,
  });
}
