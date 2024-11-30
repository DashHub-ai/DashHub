import clsx from 'clsx';
import { Quote } from 'lucide-react';

import type { SdkRepliedMessageT } from '@llm/sdk';

import { useI18n } from '~/i18n';

import { ChatMessageContent } from './chat-message-content';

type Props = {
  message: SdkRepliedMessageT;
  darkMode?: boolean;
};

export function ChatMessageRepliedMessage({ message, darkMode }: Props) {
  const t = useI18n().pack.chat;
  const isAI = message.role === 'assistant';

  return (
    <div
      className={clsx(
        'relative flex items-center gap-2 mt-1 mb-3 p-2 border-l-2 rounded text-sm',
        'before:absolute before:right-2 before:top-1/2 before:-translate-y-1/2',
        darkMode
          ? 'border-gray-600 text-gray-300 bg-gray-800 bg-opacity-50 before:text-gray-700'
          : 'border-gray-300 text-gray-600 bg-gray-200 bg-opacity-50 before:text-gray-300',
      )}
    >
      <Quote className="top-1/2 right-2 absolute opacity-10 w-12 h-12 -translate-y-1/2" />
      <div className="flex flex-col flex-1 pr-[60px] min-w-0">
        <span className="opacity-75 font-bold text-xs">
          {isAI ? t.messages.ai : (message.creator?.email || t.messages.you)}
        </span>

        <ChatMessageContent
          content={message.content}
          truncate={60}
        />
      </div>
    </div>
  );
}
