import { type FormHookAttrs, useForm } from '@under-control/forms';
import { pipe } from 'fp-ts/lib/function';

import { runTask, tapTaskEither } from '@llm/commons';
import { createSDKPermissionUserAccessLevel, type SdkCreateProjectInputT, useSdkForLoggedIn } from '@llm/sdk';
import { usePredefinedFormValidators, useSaveTaskEitherNotification } from '@llm/ui';

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
  const { sdks, session } = useSdkForLoggedIn();
  const { required, requiredListItem } = usePredefinedFormValidators<SdkCreateProjectInputT>();
  const saveNotifications = useSaveTaskEitherNotification();

  return useForm({
    resetAfterSubmit: false,
    onSubmit: (data: SdkCreateProjectInputT) => pipe(
      sdks.dashboard.projects.create({
        ...data,
        permissions: [
          createSDKPermissionUserAccessLevel('write', session.token.sub),
        ],
      }),
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
