import { type FormHookAttrs, useForm } from '@under-control/forms';
import { flow } from 'fp-ts/lib/function';

import { runTask, tapTaskEither } from '@llm/commons';
import { type SdkCreateOrganizationInputT, useSdkForLoggedIn } from '@llm/sdk';
import { usePredefinedFormValidators, useSaveTaskEitherNotification } from '@llm/ui';

type CreateOrganizationFormHookAttrs =
  & Omit<
    FormHookAttrs<SdkCreateOrganizationInputT>,
    'validation' | 'onSubmit'
  >
  & {
    onAfterSubmit?: VoidFunction;
  };

export function useOrganizationCreateForm(
  {
    onAfterSubmit,
    ...props
  }: CreateOrganizationFormHookAttrs,
) {
  const { sdks } = useSdkForLoggedIn();
  const { required, positive } = usePredefinedFormValidators<SdkCreateOrganizationInputT>();
  const saveNotifications = useSaveTaskEitherNotification();

  return useForm({
    resetAfterSubmit: false,
    onSubmit: flow(
      sdks.dashboard.organizations.create,
      saveNotifications,
      tapTaskEither(() => onAfterSubmit?.()),
      runTask,
    ),
    validation: {
      mode: ['blur', 'submit'],
      validators: () => [
        required('name'),
        positive('maxNumberOfUsers'),
      ],
    },
    ...props,
  });
}
