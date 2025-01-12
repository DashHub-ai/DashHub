import { useControl } from '@under-control/forms';
import clsx from 'clsx';
import { takeRight } from 'fp-ts/lib/Array';
import { pipe } from 'fp-ts/lib/function';
import { Bot, ReplyIcon, User } from 'lucide-react';

import { type Overwrite, pluckTyped } from '@llm/commons';
import {
  type SdkRepeatedMessageLike,
  type SdkSearchMessageItemT,
  useSdkForLoggedIn,
} from '@llm/sdk';
import { useI18n } from '~/i18n';

import type { AIStreamObservable } from '../hooks';

import { FilesCardsList } from '../files';
import { ToolbarSmallActionButton } from './buttons';
import { ChatMessageAIActions } from './chat-message-ai-actions';
import { ChatMessageContent } from './chat-message-content';
import { ChatMessageRepliedMessage } from './chat-message-replied-message';
import { ChatMessageVariants } from './chat-message-variants';

export type SdkRepeatedMessageItemT = SdkRepeatedMessageLike<
  Overwrite<SdkSearchMessageItemT, {
    content: string | AIStreamObservable;
  }>
>;

type Props = {
  message: SdkRepeatedMessageItemT;
  isLast: boolean;
  readOnly?: boolean;
  archived?: boolean;
  onRefreshResponse: (message: Omit<SdkRepeatedMessageItemT, 'content'>) => void;
  onReply: (message: SdkRepeatedMessageItemT) => void;
  onAction: (action: string) => void;
};

export function ChatMessage({ archived, message, isLast, readOnly, onRefreshResponse, onReply, onAction }: Props) {
  const t = useI18n().pack.chat;
  const { session } = useSdkForLoggedIn();

  const currentVariant = useControl<number>({
    defaultValue: 0,
  });

  const repeats = takeRight(5)(message.repeats);
  const { createdAt, role, content, creator, files } = (
    currentVariant.value
      ? repeats[currentVariant.value - 1]
      : message
  );

  const isAI = role === 'assistant';
  const isYou = creator?.email === session.token.email;

  return (
    <div
      className={clsx(
        'flex items-start gap-2',
        'animate-messageSlideIn',
        {
          'mb-5': !repeats.length,
          'mb-10': repeats.length,
          'flex-row': isAI,
          'flex-row-reverse': !isAI,
          'opacity-75': readOnly && archived,
          'opacity-0': !readOnly || !archived,
        },
      )}
    >
      <div
        className={clsx(
          'flex flex-shrink-0 justify-center items-center border rounded-full w-8 h-8',
          {
            'bg-gray-100 border-gray-200': isAI,
            'bg-gray-700 border-gray-600': !isAI,
            'opacity-75': readOnly && archived,
          },
        )}
      >
        {isAI
          ? <Bot className="w-5 h-5 text-gray-600" />
          : <User className="w-5 h-5 text-white" />}
      </div>

      <div
        className={clsx(
          'flex flex-col gap-2 w-full',
          isAI ? 'items-start' : 'items-end',
        )}
      >
        <div
          className={clsx(
            'relative px-4 py-2 border rounded-xl min-w-[30%] max-w-[70%]',
            'before:absolute before:top-[12px] before:border-8 before:border-transparent before:border-t-8',
            {
              'bg-gray-100 before:border-gray-100 before:left-[-8px] border-gray-200 before:border-l-0 before:border-r-[12px]': isAI,
              'bg-gray-700 text-white before:border-gray-700 before:right-[-8px] border-gray-600 before:border-r-0 before:border-l-[12px]': !isAI,
              'cursor-default opacity-75': readOnly && archived,
            },
          )}
        >
          {!isAI && message.repliedMessage && (
            <ChatMessageRepliedMessage
              message={message.repliedMessage}
              darkMode
            />
          )}

          <ChatMessageContent
            key={typeof content}
            content={content}
            disabled={!isLast || readOnly}
            darkMode={!isAI}
            showToolbars={isAI}
            onAction={onAction}
          />

          <div className="flex justify-between items-center gap-6 mt-1 text-xs">
            <span className="opacity-50">
              {new Date(createdAt).toLocaleTimeString()}
            </span>

            <div className="flex items-center gap-2">
              {!readOnly && (
                <ToolbarSmallActionButton
                  title={t.actions.reply}
                  darkMode={!isAI}
                  onClick={() => onReply(message)}
                >
                  <ReplyIcon
                    size={14}
                    className="opacity-50 hover:opacity-100"
                  />
                </ToolbarSmallActionButton>
              )}

              {isAI
                ? (!readOnly && (
                    <ChatMessageAIActions
                      isLast={isLast}
                      message={message}
                      onRefreshResponse={() => onRefreshResponse(message)}
                    />
                  ))
                : (
                    <div className="flex items-center gap-1 opacity-75 text-white">
                      <User size={12} />
                      <span>{isYou ? t.messages.you : creator?.email}</span>
                    </div>
                  )}
            </div>
          </div>

          {isAI && repeats.length > 0 && (
            <ChatMessageVariants
              {...currentVariant.bind.entire()}
              total={repeats.length + 1}
            />
          )}
        </div>

        {files.length > 0 && (
          <div className="flex gap-2 mb-2">
            <FilesCardsList
              withListIcon
              items={pipe(files, pluckTyped('resource'))}
              itemPropsFn={() => ({
                limitWidth: false,
                withBackground: true,
              })}
            />
          </div>
        )}
      </div>
    </div>
  );
}
