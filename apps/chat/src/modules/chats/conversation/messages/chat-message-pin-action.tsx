import { pipe } from 'fp-ts/lib/function';
import { Pin } from 'lucide-react';

import { tapTaskEitherError, toVoidTE, tryOrThrowTE } from '@llm/commons';
import { useAsyncCallback } from '@llm/commons-front';
import { useSdkForLoggedIn } from '@llm/sdk';
import { useI18n } from '~/i18n';
import { useSaveErrorNotification } from '~/ui';

import { ToolbarSmallActionButton } from './buttons';

type Props = {
  messageId: string;
};

export function ChatMessagePinAction({ messageId }: Props) {
  const { sdks } = useSdkForLoggedIn();
  const t = useI18n().pack.chat;

  const isPinned = false;
  const pinId = 123;

  const { pinnedMessages } = sdks.dashboard;

  const showErrorNotification = useSaveErrorNotification();
  const [handlePin, pinState] = useAsyncCallback(
    pipe(
      isPinned
        ? pipe(pinnedMessages.delete({ id: pinId }), toVoidTE)
        : pipe(pinnedMessages.create({ messageId }), toVoidTE),
      tapTaskEitherError(showErrorNotification),
      tryOrThrowTE,
    ),
  );

  return (
    <ToolbarSmallActionButton
      disabled={pinState.isLoading}
      title={isPinned ? t.actions.unpin : t.actions.pin}
      icon={<Pin size={14} className={isPinned ? 'text-blue-500' : 'text-gray-500'} />}
      onClick={handlePin}
    />
  );
}
