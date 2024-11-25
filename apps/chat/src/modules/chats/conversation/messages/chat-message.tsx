import clsx from 'clsx';
import { Bot, User } from 'lucide-react';

import type { Overwrite } from '@llm/commons';

import { type SdkSearchMessageItemT, useSdkForLoggedIn } from '@llm/sdk';
import { useI18n } from '~/i18n';

import type { AIStreamObservable } from '../hooks';

import { ChatMessageAIActions } from './chat-message-ai-actions';
import { ChatMessageContent } from './chat-message-content';
import { ChatMessageVariants } from './chat-message-variants';

type Props = {
  message: Overwrite<SdkSearchMessageItemT, {
    content: string | AIStreamObservable;
  }>;

  isLast: boolean;
  readOnly?: boolean;
};

export function ChatMessage({ message, isLast, readOnly }: Props) {
  const t = useI18n().pack.chat;
  const { session } = useSdkForLoggedIn();
  const { role, content, repeats, creator } = message;

  const isAI = role === 'assistant';
  const isYou = creator?.email === session.token.email;

  return (
    <div
      className={clsx(
        'flex items-start gap-2',
        'animate-slideIn',
        {
          'mb-6': !repeats.length,
          'mb-10': repeats.length,
          'flex-row': isAI,
          'flex-row-reverse': !isAI,
          'opacity-75': readOnly,
          'opacity-0': !readOnly,
        },
      )}
    >
      <div
        className={clsx(
          'flex flex-shrink-0 justify-center items-center border rounded-full w-8 h-8',
          {
            'bg-gray-100 border-gray-200': isAI,
            'bg-gray-700 border-gray-600': !isAI,
            'opacity-75': readOnly,
          },
        )}
      >
        {isAI
          ? <Bot className="w-5 h-5 text-gray-600" />
          : <User className="w-5 h-5 text-white" />}
      </div>

      <div
        className={clsx(
          'relative px-4 py-2 border rounded-2xl min-w-[30%] max-w-[70%]',
          'before:absolute before:top-[12px] before:border-8 before:border-transparent before:border-t-8',
          {
            'bg-gray-100 before:border-gray-100 before:left-[-8px] border-gray-200 before:border-l-0 before:border-r-[12px]': isAI,
            'bg-gray-700 text-white before:border-gray-700 before:right-[-8px] border-gray-600 before:border-r-0 before:border-l-[12px]': !isAI,
            'cursor-default opacity-75': readOnly,
          },
        )}
      >
        <ChatMessageContent key={typeof content} content={content} />

        <div className="flex justify-between items-center gap-6 mt-1 text-xs">
          <span className="opacity-50">{new Date(message.createdAt).toLocaleTimeString()}</span>
          {isAI
            ? (!readOnly && <ChatMessageAIActions isLast={isLast} message={message} />)
            : (
                <div className="flex items-center gap-1 opacity-75 text-white">
                  <User size={12} />
                  <span>{isYou ? t.messages.you : message.creator?.email}</span>
                </div>
              )}
        </div>

        {isAI && repeats.length > 0 && <ChatMessageVariants />}
      </div>
    </div>
  );
}
