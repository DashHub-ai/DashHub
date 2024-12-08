import { type FormHookAttrs, useForm } from '@under-control/forms';
import { flow } from 'fp-ts/lib/function';

import { runTask, tapTaskEither } from '@llm/commons';
import {
  type SdkTableRowWithIdT,
  type SdkUpdateAppInputT,
  useSdkForLoggedIn,
} from '@llm/sdk';
import { usePredefinedFormValidators, useSaveTaskEitherNotification } from '@llm/ui';

type UpdateAppFormHookAttrs =
  & Omit<
    FormHookAttrs<SdkUpdateAppInputT & SdkTableRowWithIdT>,
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
  const { required, requiredListItem } = usePredefinedFormValidators<SdkUpdateAppInputT & SdkTableRowWithIdT>();
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
        requiredListItem('category'),
        required('name'),
        required('description'),
        required('chatContext'),
      ],
    },
    ...props,
  });
}
