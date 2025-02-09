import { type FormHookAttrs, useForm } from '@under-control/forms';
import { flow } from 'fp-ts/lib/function';

import { runTask, tapTaskEither } from '@llm/commons';
import {
  type SdkUserT,
  useSdkForLoggedIn,
} from '@llm/sdk';
import { usePredefinedFormValidators } from '~/hooks';
import { useUseAuthFormValidator } from '~/modules/users/form';
import { useSaveTaskEitherNotification } from '~/ui';

type UpdateMeFormHookAttrs =
  & Omit<
    FormHookAttrs<SdkUserT>,
    'validation' | 'onSubmit'
  >
  & {
    onAfterSubmit?: VoidFunction;
  };

export function useUpdateMeForm(
  {
    onAfterSubmit,
    ...props
  }: UpdateMeFormHookAttrs,
) {
  const { sdks } = useSdkForLoggedIn();
  const { emailFormatValidator, required } = usePredefinedFormValidators<SdkUserT>();
  const saveNotifications = useSaveTaskEitherNotification();
  const authValidator = useUseAuthFormValidator<SdkUserT>();

  return useForm({
    resetAfterSubmit: false,
    onSubmit: flow(
      sdks.dashboard.users.me.update,
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
