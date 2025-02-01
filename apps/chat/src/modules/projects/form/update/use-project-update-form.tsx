import { type FormHookAttrs, type Overwrite, useForm } from '@under-control/forms';
import { flow } from 'fp-ts/lib/function';

import { runTask, tapTaskEither } from '@llm/commons';
import {
  type SdkPermissionT,
  type SdkTableRowWithIdT,
  type SdkUpdateProjectInputT,
  useSdkForLoggedIn,
} from '@llm/sdk';
import { usePredefinedFormValidators } from '~/hooks';
import { useSaveTaskEitherNotification } from '~/ui';

type UpdateProjectFormValue = Overwrite<SdkUpdateProjectInputT & SdkTableRowWithIdT, {
  permissions?: SdkPermissionT[] | null;
}>;

type UpdateProjectFormHookAttrs =
  & Omit<
    FormHookAttrs<UpdateProjectFormValue>,
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
  const { required } = usePredefinedFormValidators<UpdateProjectFormValue>();
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
