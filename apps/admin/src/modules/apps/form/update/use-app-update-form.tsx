import { type FormHookAttrs, type Overwrite, useForm } from '@under-control/forms';
import { flow } from 'fp-ts/lib/function';

import { runTask, tapTaskEither } from '@llm/commons';
import {
  type SdkPermissionT,
  type SdkTableRowWithIdT,
  type SdkUpdateAppInputT,
  useSdkForLoggedIn,
} from '@llm/sdk';
import { usePredefinedFormValidators, useSaveTaskEitherNotification } from '@llm/ui';

type AppFormValue = Overwrite<
  SdkUpdateAppInputT & SdkTableRowWithIdT,
  {
    permissions?: SdkPermissionT[] | null;
  }
>;

type UpdateAppFormHookAttrs =
  & Omit<
    FormHookAttrs<AppFormValue>,
    'validation' | 'onSubmit'
  >
  & {
    onAfterSubmit?: VoidFunction;
  };

export function useAppUpdateForm(
  {
    onAfterSubmit,
    ...props
  }: UpdateAppFormHookAttrs,
) {
  const { sdks } = useSdkForLoggedIn();
  const { required } = usePredefinedFormValidators<AppFormValue>();
  const saveNotifications = useSaveTaskEitherNotification();

  return useForm({
    resetAfterSubmit: false,
    onSubmit: flow(
      sdks.dashboard.apps.update,
      saveNotifications,
      tapTaskEither(() => onAfterSubmit?.()),
      runTask,
    ),
    validation: {
      mode: ['blur', 'submit'],
      validators: () => [
        required('name'),
        required('chatContext'),
      ],
    },
    ...props,
  });
}
