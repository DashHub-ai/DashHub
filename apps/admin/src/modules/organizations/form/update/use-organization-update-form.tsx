import { type FormHookAttrs, useForm } from '@under-control/forms';
import { flow } from 'fp-ts/lib/function';

import { runTask, tapTaskEither } from '@llm/commons';
import {
  type SdkTableRowWithIdT,
  type SdkUpdateOrganizationInputT,
  useSdkForLoggedIn,
} from '@llm/sdk';
import { usePredefinedFormValidators, useSaveTaskEitherNotification } from '@llm/ui';

type UpdateOrganizationFormHookAttrs =
  & Omit<
    FormHookAttrs<SdkUpdateOrganizationInputT & SdkTableRowWithIdT>,
    'validation' | 'onSubmit'
  >
  & {
    onAfterSubmit?: VoidFunction;
  };

export function useOrganizationUpdateForm(
  {
    onAfterSubmit,
    ...props
  }: UpdateOrganizationFormHookAttrs,
) {
  const { sdks } = useSdkForLoggedIn();
  const { required, positive } = usePredefinedFormValidators<SdkUpdateOrganizationInputT & SdkTableRowWithIdT>();
  const saveNotifications = useSaveTaskEitherNotification();

  return useForm({
    resetAfterSubmit: false,
    onSubmit: flow(
      sdks.dashboard.organizations.update,
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
