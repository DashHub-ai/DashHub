import { type FormHookAttrs, type Overwrite, useForm } from '@under-control/forms';
import { flow } from 'fp-ts/lib/function';

import { runTask, tapTaskEither } from '@dashhub/commons';
import {
  type SdkCreateAppInputT,
  type SdkCreateAppOutputT,
  type SdkPermissionT,
  type SdkTableRowWithIdNameT,
  useSdkForLoggedIn,
} from '@dashhub/sdk';
import { usePredefinedFormValidators } from '~/hooks';
import { useSaveTaskEitherNotification } from '~/ui';

export type CreateAppFormValue = Overwrite<SdkCreateAppInputT, {
  permissions?: SdkPermissionT[] | null;
  aiModel: SdkTableRowWithIdNameT | null;
}>;

type CreateAppFormHookAttrs =
  & Omit<
    FormHookAttrs<CreateAppFormValue>,
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
  const { required, requiredListItem } = usePredefinedFormValidators<CreateAppFormValue>();
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
