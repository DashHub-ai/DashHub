import { type FormHookAttrs, useForm } from '@under-control/forms';
import { flow } from 'fp-ts/lib/function';

import { isObjectWithFakeID, runTask, tapTaskEither } from '@llm/commons';
import { useSdkForLoggedIn } from '@llm/sdk';
import { usePredefinedFormValidators, useSaveTaskEitherNotification } from '@llm/ui';

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
  const { emailFormatValidator, requiredPathByPred, required } = usePredefinedFormValidators<CreateUserFormValue>();
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
        required('name'),
        emailFormatValidator('email'),
        authValidator('auth'),
        requiredPathByPred(
          'organization',
          ({ globalValue, value }) => globalValue.role === 'user' && (!value?.item || isObjectWithFakeID(value.item)),
        ),
      ],
    },
    ...props,
  });
}
