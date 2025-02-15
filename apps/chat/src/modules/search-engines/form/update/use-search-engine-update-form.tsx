import { type FormHookAttrs, useForm } from '@under-control/forms';
import { flow } from 'fp-ts/lib/function';

import { runTask, tapTaskEither } from '@llm/commons';
import {
  type SdkTableRowWithIdT,
  type SdkUpdateSearchEngineInputT,
  useSdkForLoggedIn,
} from '@llm/sdk';
import { usePredefinedFormValidators } from '~/hooks';
import { useSaveTaskEitherNotification } from '~/ui';

type UpdateSearchEngineFormHookAttrs =
  & Omit<
    FormHookAttrs<SdkUpdateSearchEngineInputT & SdkTableRowWithIdT>,
    'validation' | 'onSubmit'
  >
  & {
    onAfterSubmit?: VoidFunction;
  };

export function useSearchEngineUpdateForm(
  {
    onAfterSubmit,
    ...props
  }: UpdateSearchEngineFormHookAttrs,
) {
  const { sdks } = useSdkForLoggedIn();
  const { required } = usePredefinedFormValidators<SdkUpdateSearchEngineInputT & SdkTableRowWithIdT>();
  const saveNotifications = useSaveTaskEitherNotification();

  return useForm({
    resetAfterSubmit: false,
    onSubmit: flow(
      sdks.dashboard.searchEngines.update,
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
