import { type FormHookAttrs, useForm } from '@under-control/forms';
import { flow } from 'fp-ts/lib/function';

import { runTask, tapTaskEither } from '@llm/commons';
import { type SdkCreateAppInputT, type SdkCreateAppOutputT, useSdkForLoggedIn } from '@llm/sdk';
import { usePredefinedFormValidators, useSaveTaskEitherNotification } from '@llm/ui';

type CreateAppFormHookAttrs =
  & Omit<
    FormHookAttrs<SdkCreateAppInputT>,
    'validation' | 'onSubmit' | 'onAfterSubmit'
  >
  & {
    onAfterSubmit?: (result: SdkCreateAppOutputT) => void;
  };

export function useAppCreateForm(
  {
    onAfterSubmit,
    ...props
  }: CreateAppFormHookAttrs,
) {
  const { sdks } = useSdkForLoggedIn();
  const { required, requiredListItem } = usePredefinedFormValidators<SdkCreateAppInputT>();
  const saveNotifications = useSaveTaskEitherNotification();

  return useForm({
    resetAfterSubmit: false,
    onSubmit: flow(
      sdks.dashboard.apps.create,
      saveNotifications,
      tapTaskEither(result => onAfterSubmit?.(result)),
      runTask,
    ),
    validation: {
      mode: ['blur', 'submit'],
      validators: () => [
        requiredListItem('category'),
        required('name'),
        required('description'),
        required('chatContext'),
        requiredListItem('organization'),
      ],
    },
    ...props,
  });
}
