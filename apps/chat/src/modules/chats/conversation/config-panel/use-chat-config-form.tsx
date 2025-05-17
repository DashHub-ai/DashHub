import { type FormHookAttrs, type Overwrite, useForm } from '@under-control/forms';
import { flow } from 'fp-ts/lib/function';

import { runTask, tapTaskEither } from '@dashhub/commons';
import {
  castSdkChatSummaryToUpdateInput,
  type SdkChatT,
  type SdkPermissionT,
  type SdkTableRowWithUuidT,
  useSdkForLoggedIn,
} from '@dashhub/sdk';
import { useSaveTaskEitherNotification } from '~/ui';

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
        summary: castSdkChatSummaryToUpdateInput(value.summary),
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
