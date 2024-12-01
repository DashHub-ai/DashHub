import { type FormHookAttrs, useForm } from '@under-control/forms';
import { flow } from 'fp-ts/lib/function';

import { runTask, tapTaskEither } from '@llm/commons';
import { type SdkTableRowWithUuidT, type SdkUpdateChatInputT, useSdkForLoggedIn } from '@llm/sdk';
import { useSaveTaskEitherNotification } from '@llm/ui';

type UpdateChatFormHookAttrs =
  & Omit<
    FormHookAttrs<SdkUpdateChatInputT & SdkTableRowWithUuidT>,
    'validation' | 'onSubmit'
  >
  & {
    onAfterSubmit?: VoidFunction;
  };

export function useChatConfigForm(
  {
    onAfterSubmit,
    ...props
  }: UpdateChatFormHookAttrs,
) {
  const { sdks } = useSdkForLoggedIn();
  const saveNotifications = useSaveTaskEitherNotification();

  return useForm({
    resetAfterSubmit: false,
    onSubmit: flow(
      sdks.dashboard.chats.update,
      saveNotifications,
      tapTaskEither(() => onAfterSubmit?.()),
      runTask,
    ),
    validation: {
      mode: ['blur', 'submit'],
    },
    ...props,
  });
}