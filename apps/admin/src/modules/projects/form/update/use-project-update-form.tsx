import { type FormHookAttrs, useForm } from '@under-control/forms';
import { flow } from 'fp-ts/lib/function';

import { runTask, tapTaskEither } from '@llm/commons';
import {
  type SdkTableRowWithIdT,
  type SdkUpdateProjectInputT,
  useSdkForLoggedIn,
} from '@llm/sdk';
import { useSaveTaskEitherNotification } from '~/components/notifications';
import { usePredefinedFormValidators } from '~/hooks';

type UpdateProjectFormHookAttrs =
  & Omit<
    FormHookAttrs<SdkUpdateProjectInputT & SdkTableRowWithIdT>,
    'validation' | 'onSubmit'
  >
  & {
    onAfterSubmit?: VoidFunction;
  };

export function useProjectUpdateForm(
  {
    onAfterSubmit,
    ...props
  }: UpdateProjectFormHookAttrs,
) {
  const { sdks } = useSdkForLoggedIn();
  const { required } = usePredefinedFormValidators<SdkUpdateProjectInputT & SdkTableRowWithIdT>();
  const saveNotifications = useSaveTaskEitherNotification();

  return useForm({
    resetAfterSubmit: false,
    onSubmit: flow(
      sdks.dashboard.projects.update,
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
