import { clsx } from 'clsx';
import { Bot, X as CloseIcon, User } from 'lucide-react';

import {
  ActionButton,
  ChatMessageContent,
  type SdkRepeatedMessageItemT,
} from '../messages';

type Props = {
  message: SdkRepeatedMessageItemT;
  onClose: () => void;
};

export function ChatReplyMessage({ message, onClose }: Props) {
  const isAI = message.role === 'assistant';

  return (
    <div className="relative flex items-center gap-3 mb-3 pl-4">
      <div className="top-0 bottom-0 left-0 absolute bg-gray-300 rounded-full w-[3px]" />

      <div className="flex flex-1 items-center gap-3 py-2.5">
        <div
          className={clsx(
            'flex flex-shrink-0 justify-center items-center border rounded-full w-6 h-6',
            isAI ? 'bg-gray-100 border-gray-200' : 'bg-gray-700 border-gray-600',
          )}
        >
          {isAI
            ? <Bot className="w-4 h-4 text-gray-600" />
            : <User className="w-4 h-4 text-white" />}
        </div>

        <div className="flex-1 line-clamp-1 text-gray-500">
          <ChatMessageContent content={message.content} />
        </div>
      </div>

      <ActionButton
        title="Close"
        onClick={onClose}
      >
        <CloseIcon size={14} className="opacity-50 hover:opacity-100" />
      </ActionButton>
    </div>
  );
}
