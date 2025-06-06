import { type FormHookAttrs, useForm } from '@under-control/forms';
import { flow } from 'fp-ts/lib/function';

import { runTask, tapTaskEither } from '@dashhub/commons';
import {
  type SdkTableRowWithIdT,
  type SdkUpdateAppCategoryInputT,
  useSdkForLoggedIn,
} from '@dashhub/sdk';
import { usePredefinedFormValidators } from '~/hooks';
import { useSaveTaskEitherNotification } from '~/ui';

type UpdateAppCategoryFormHookAttrs =
  & Omit<
    FormHookAttrs<SdkUpdateAppCategoryInputT & SdkTableRowWithIdT>,
    'validation' | 'onSubmit'
  >
  & {
    onAfterSubmit?: VoidFunction;
  };

export function useAppCategoryUpdateForm(
  {
    onAfterSubmit,
    ...props
  }: UpdateAppCategoryFormHookAttrs,
) {
  const { sdks } = useSdkForLoggedIn();
  const { required } = usePredefinedFormValidators<SdkUpdateAppCategoryInputT & SdkTableRowWithIdT>();
  const saveNotifications = useSaveTaskEitherNotification();

  return useForm({
    resetAfterSubmit: false,
    onSubmit: flow(
      sdks.dashboard.appsCategories.update,
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
