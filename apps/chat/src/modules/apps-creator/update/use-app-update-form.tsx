import { type FormHookAttrs, type Overwrite, useForm } from '@under-control/forms';
import { flow } from 'fp-ts/lib/function';

import { runTask, tapTaskEither } from '@dashhub/commons';
import {
  type SdkPermissionT,
  type SdkTableRowWithIdNameT,
  type SdkTableRowWithIdT,
  type SdkUpdateAppInputT,
  useSdkForLoggedIn,
} from '@dashhub/sdk';
import { usePredefinedFormValidators } from '~/hooks';
import { useSaveTaskEitherNotification } from '~/ui';

type UpdateAppValue = Overwrite<SdkUpdateAppInputT & SdkTableRowWithIdT, {
  permissions?: SdkPermissionT[] | null;
  aiModel: SdkTableRowWithIdNameT | null;
}>;

type UpdateAppFormHookAttrs =
  & Omit<
    FormHookAttrs<UpdateAppValue>,
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
  const { required, requiredListItem } = usePredefinedFormValidators<UpdateAppValue & SdkTableRowWithIdT>();
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
