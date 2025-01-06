import { type FormHookAttrs, type Overwrite, useForm } from '@under-control/forms';
import { flow } from 'fp-ts/lib/function';

import { runTask, tapTaskEither } from '@llm/commons';
import {
  type SdkChatT,
  type SdkPermissionT,
  type SdkTableRowWithUuidT,
  useSdkForLoggedIn,
} from '@llm/sdk';
import { useSaveTaskEitherNotification } from '@llm/ui';

type UpdateChatFormValue = Overwrite<SdkChatT & SdkTableRowWithUuidT, {
  permissions?: SdkPermissionT[] | null;
}>;

type UpdateChatFormHookAttrs =
  & Omit<
    FormHookAttrs<UpdateChatFormValue>,
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
      value => sdks.dashboard.chats.update({
        ...value,
        summary: {
          name: value.summary.name.generated
            ? { generated: true, value: null }
            : { generated: false, value: value.summary.name.value || '' },

          content: value.summary.content.generated
            ? { generated: true, value: null }
            : { generated: false, value: value.summary.content.value || '' },
        },
      }),
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
