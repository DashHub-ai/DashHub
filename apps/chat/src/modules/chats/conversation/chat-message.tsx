import clsx from 'clsx';
import { Bot, RefreshCwIcon, ReplyIcon, User, WandSparklesIcon } from 'lucide-react';

import { type SdkSearchMessageItemT, useSdkForLoggedIn } from '@llm/sdk';
import { useI18n } from '~/i18n';

type Props = {
  message: SdkSearchMessageItemT;
  isLast: boolean;
};

export function ChatMessage({ message, isLast }: Props) {
  const t = useI18n().pack.chat;
  const { session } = useSdkForLoggedIn();

  const isAI = message.role === 'assistant';
  const isYou = message.creator?.email === session.token.email;

  return (
    <div
      className={clsx(
        'flex items-start gap-2 mb-6',
        'animate-slideIn opacity-0',
        {
          'flex-row': isAI,
          'flex-row-reverse': !isAI,
        },
      )}
    >
      <div
        className={clsx('flex flex-shrink-0 justify-center items-center border rounded-full w-8 h-8', {
          'bg-gray-100 border-gray-200': isAI,
          'bg-gray-700 border-gray-600': !isAI,
        })}
      >
        {isAI
          ? (
              <Bot className="w-5 h-5 text-gray-600" />
            )
          : (
              <User className="w-5 h-5 text-white" />
            )}
      </div>

      <div
        className={clsx(
          'relative px-4 py-2 border rounded-2xl min-w-[30%] max-w-[70%]',
          'before:absolute before:top-[12px] before:border-8 before:border-transparent before:border-t-8',
          {
            'bg-gray-100 before:border-gray-100 before:left-[-8px] border-gray-200 before:border-l-0 before:border-r-[12px]': isAI,
            'bg-gray-700 text-white before:border-gray-700 before:right-[-8px] border-gray-600 before:border-r-0 before:border-l-[12px]': !isAI,
          },
        )}
      >
        <p className="text-sm">{message.content}</p>
        <div className="flex justify-between items-center gap-6 mt-1 text-xs">
          <span className="opacity-50">{new Date(message.createdAt).toLocaleTimeString()}</span>
          {isAI
            ? (
                <MessageAIActions isLast={isLast} message={message} />
              )
            : (
                <div className="flex items-center gap-1 opacity-75 text-white">
                  <User size={12} />
                  <span>{isYou ? t.messages.you : message.creator?.email}</span>
                </div>
              )}
        </div>
        {isAI && <MessageVariants />}
      </div>
    </div>
  );
}

function MessageAIActions({ isLast, message }: { isLast: boolean; message: SdkSearchMessageItemT; }) {
  return (
    <div className="flex items-center gap-2">
      {isLast && (
        <button
          type="button"
          className="hover:bg-gray-200 p-1 rounded transition-colors"
          title="Refresh response"
        >
          <RefreshCwIcon size={14} className="opacity-50 hover:opacity-100" />
        </button>
      )}

      <button
        type="button"
        className="hover:bg-gray-200 p-1 rounded transition-colors"
        title="Reply to this message"
      >
        <ReplyIcon size={14} className="opacity-50 hover:opacity-100" />
      </button>

      {(message as any).aiModel && (
        <div className="flex items-center gap-1 text-muted-foreground">
          <WandSparklesIcon size={12} />
          <span>{(message as any).aiModel}</span>
        </div>
      )}
    </div>
  );
}

function MessageVariants() {
  return (
    <div className="right-4 bottom-[-24px] absolute flex gap-0 border-gray-200 border border-t-0 rounded-b-lg rounded-t-none overflow-hidden">
      {[1, 2, 3].map((variant, index) => (
        <button
          key={variant}
          type="button"
          className={clsx(
            'flex justify-center items-center border-r last:border-r-0 w-6 h-[22px] text-xs transition-colors',
            {
              'bg-gray-200 text-gray-700 font-medium': !index,
              'bg-white hover:bg-gray-50 text-gray-500': index > 0,
            },
          )}
        >
          {variant}
        </button>
      ))}
    </div>
  );
}
