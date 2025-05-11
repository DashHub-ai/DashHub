import { type FormHookAttrs, useForm } from '@under-control/forms';
import { flow } from 'fp-ts/lib/function';

import { runTask, tapTaskEither } from '@dashhub/commons';
import {
  type SdkTableRowWithIdT,
  type SdkUpdateUsersGroupInputT,
  useSdkForLoggedIn,
} from '@dashhub/sdk';
import { usePredefinedFormValidators } from '~/hooks';
import { useSaveTaskEitherNotification } from '~/ui';

type UpdateUserFormValue = SdkUpdateUsersGroupInputT & SdkTableRowWithIdT;

type UpdateUsersGroupFormHookAttrs =
  & Omit<
    FormHookAttrs<UpdateUserFormValue>,
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
  const { required } = usePredefinedFormValidators<UpdateUserFormValue>();
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
