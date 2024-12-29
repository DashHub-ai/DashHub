import { type FormHookAttrs, useForm } from '@under-control/forms';
import { flow } from 'fp-ts/lib/function';

import { runTask, tapTaskEither } from '@llm/commons';
import {
  type SdkTableRowWithIdT,
  type SdkUpdateUsersGroupInputT,
  useSdkForLoggedIn,
} from '@llm/sdk';
import { usePredefinedFormValidators, useSaveTaskEitherNotification } from '@llm/ui';

type UpdateUsersGroupFormHookAttrs =
  & Omit<
    FormHookAttrs<SdkUpdateUsersGroupInputT & SdkTableRowWithIdT>,
    'validation' | 'onSubmit'
  >
  & {
    onAfterSubmit?: VoidFunction;
  };

export function useUsersGroupUpdateForm(
  {
    onAfterSubmit,
    ...props
  }: UpdateUsersGroupFormHookAttrs,
) {
  const { sdks } = useSdkForLoggedIn();
  const { required } = usePredefinedFormValidators<SdkUpdateUsersGroupInputT & SdkTableRowWithIdT>();
  const saveNotifications = useSaveTaskEitherNotification();

  return useForm({
    resetAfterSubmit: false,
    onSubmit: flow(
      sdks.dashboard.usersGroups.update,
      saveNotifications,
      tapTaskEither(() => onAfterSubmit?.()),
      runTask,
    ),
    validation: {
      mode: ['blur', 'submit'],
      validators: () => [
        required('name'),
      ],
    },
    ...props,
  });
}
