import { type FormHookAttrs, type Overwrite, useForm } from '@under-control/forms';
import { flow } from 'fp-ts/lib/function';

import { runTask, tapTaskEither } from '@dashhub/commons';
import {
  type SdkPermissionT,
  type SdkTableRowWithIdT,
  type SdkUpdateAIExternalAPIInputT,
  useSdkForLoggedIn,
} from '@dashhub/sdk';
import { usePredefinedFormValidators } from '~/hooks';
import { useSaveTaskEitherNotification } from '~/ui';

type UpdateAIExternalAPIValue = Overwrite<SdkUpdateAIExternalAPIInputT & SdkTableRowWithIdT, {
  permissions?: SdkPermissionT[] | null;
}>;

type UpdateAIExternalAPIFormHookAttrs =
  & Omit<
    FormHookAttrs<UpdateAIExternalAPIValue>,
    'validation' | 'onSubmit'
  >
  & {
    onAfterSubmit?: VoidFunction;
  };

export function useAIExternalAPIUpdateForm(
  {
    onAfterSubmit,
    ...props
  }: UpdateAIExternalAPIFormHookAttrs,
) {
  const { sdks } = useSdkForLoggedIn();
  const { required } = usePredefinedFormValidators<UpdateAIExternalAPIValue & SdkTableRowWithIdT>();
  const saveNotifications = useSaveTaskEitherNotification();

  return useForm({
    resetAfterSubmit: false,
    onSubmit: flow(
      sdks.dashboard.aiExternalAPIs.update,
      saveNotifications,
      tapTaskEither(() => onAfterSubmit?.()),
      runTask,
    ),
    validation: {
      mode: ['blur', 'submit'],
      validators: () => [
        required('name'),
        required('description'),
      ],
    },
    ...props,
  });
}
