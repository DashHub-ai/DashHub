import { type FormHookAttrs, useForm } from '@under-control/forms';
import { flow } from 'fp-ts/lib/function';

import { runTask, tapTaskEither } from '@llm/commons';
import { type SdkCreateProjectInputT, useSdkForLoggedIn } from '@llm/sdk';
import { useSaveTaskEitherNotification } from '~/components';
import { usePredefinedFormValidators } from '~/hooks';

type CreateProjectFormHookAttrs =
  & Omit<
    FormHookAttrs<SdkCreateProjectInputT>,
    'validation' | 'onSubmit'
  >
  & {
    onAfterSubmit?: VoidFunction;
  };

export function useProjectCreateForm(
  {
    onAfterSubmit,
    ...props
  }: CreateProjectFormHookAttrs,
) {
  const { sdks } = useSdkForLoggedIn();
  const { required, requiredListItem } = usePredefinedFormValidators<SdkCreateProjectInputT>();
  const saveNotifications = useSaveTaskEitherNotification();

  return useForm({
    resetAfterSubmit: false,
    onSubmit: flow(
      sdks.dashboard.projects.create,
      saveNotifications,
      tapTaskEither(() => onAfterSubmit?.()),
      runTask,
    ),
    validation: {
      mode: ['blur', 'submit'],
      validators: () => [
        required('name'),
        requiredListItem('organization'),
      ],
    },
    ...props,
  });
}
