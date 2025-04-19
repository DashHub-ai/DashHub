import { type FormHookAttrs, type Overwrite, useForm } from '@under-control/forms';
import { flow } from 'fp-ts/lib/function';

import { runTask, tapTaskEither } from '@llm/commons';
import {
  type SdkCreateAIExternalAPIInputT,
  type SdkCreateAIExternalAPIOutputT,
  type SdkPermissionT,
  useSdkForLoggedIn,
} from '@llm/sdk';
import { usePredefinedFormValidators } from '~/hooks';
import { useSaveTaskEitherNotification } from '~/ui';

export type CreateAIExternalAPIFormValue = Overwrite<SdkCreateAIExternalAPIInputT, {
  permissions?: SdkPermissionT[] | null;
}>;

type CreateAIExternalAPIFormHookAttrs =
  & Omit<
    FormHookAttrs<CreateAIExternalAPIFormValue>,
    'validation' | 'onSubmit' | 'onAfterSubmit'
  >
  & {
    onAfterSubmit?: (result: SdkCreateAIExternalAPIOutputT) => void;
  };

export function useAIExternalAPICreateForm(
  {
    onAfterSubmit,
    ...props
  }: CreateAIExternalAPIFormHookAttrs,
) {
  const { sdks } = useSdkForLoggedIn();
  const { required, requiredListItem } = usePredefinedFormValidators<CreateAIExternalAPIFormValue>();
  const saveNotifications = useSaveTaskEitherNotification();

  return useForm({
    resetAfterSubmit: false,
    onSubmit: flow(
      sdks.dashboard.aiExternalAPIs.create,
      saveNotifications,
      tapTaskEither(result => onAfterSubmit?.(result)),
      runTask,
    ),
    validation: {
      mode: ['blur', 'submit'],
      validators: () => [
        required('name'),
        required('description'),
        requiredListItem('organization'),
      ],
    },
    ...props,
  });
}
