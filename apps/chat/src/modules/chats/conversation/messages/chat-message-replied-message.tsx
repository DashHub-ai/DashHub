import clsx from 'clsx';

import type { SdkRepliedMessageT } from '@dashhub/sdk';

import { useI18n } from '~/i18n';

import { ChatMessageContent } from './content/chat-message-content';

type Props = {
  message: SdkRepliedMessageT;
};

export function ChatMessageRepliedMessage({ message }: Props) {
  const t = useI18n().pack.chat;
  const isAI = message.role === 'assistant';

  return (
    <div
      className={clsx(
        'relative mb-2 py-2 pl-3',
        'before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[3px] before:rounded-full',
        'before:bg-gray-300 bg-gray-100',
        'rounded-sm',
      )}
    >
      <div className="mb-1 font-medium text-gray-500 text-xs">
        {isAI ? t.messages.ai : (message.creator?.email || t.messages.you)}
      </div>
      <div className="text-gray-600 text-sm">
        <ChatMessageContent
          content={message.content}
          searchResults={[]}
          truncate={60}
        />
      </div>
    </div>
  );
}
