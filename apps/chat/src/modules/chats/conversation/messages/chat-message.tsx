import { useControl } from '@under-control/forms';
import clsx from 'clsx';
import { takeRight } from 'fp-ts/lib/Array';
import { pipe } from 'fp-ts/lib/function';
import { AlertCircle, Bot, ReplyIcon, User } from 'lucide-react';

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
  const timestamps = [message.createdAt, ...repeats.map(r => r.createdAt)];
  const { createdAt, role, content, creator, files } = (
    currentVariant.value
      ? repeats[currentVariant.value - 1]
      : message
  );

  const isAI = role === 'assistant';
  const isYou = creator?.email === session.token.email;
  const isCorrupted = message.corrupted;

  return (
    <div
      className={clsx(
        'flex items-start gap-4 px-4 py-2',
        'animate-messageSlideIn',
        {
          'mb-5': !repeats.length,
          'mb-10': repeats.length,
          'opacity-75': readOnly && archived,
          'opacity-0': !readOnly || !archived,
          'flex-row-reverse': !isAI && isYou,
        },
      )}
    >
      {(!isYou || isAI) && (
        <div
          className={clsx(
            'flex flex-shrink-0 justify-center items-center border rounded-full w-8 h-8',
            {
              'bg-blue-50 border-blue-200': isAI && !isCorrupted,
              'bg-red-50 border-red-200': isAI && isCorrupted,
              'bg-gray-100 border-gray-200': !isAI,
              'opacity-75': readOnly && archived,
            },
          )}
        >
          {isAI
            ? isCorrupted
              ? <AlertCircle className="w-5 h-5 text-red-600" />
              : <Bot className="w-5 h-5 text-blue-600" />
            : <User className="w-5 h-5 text-gray-600" />}
        </div>
      )}

      <div className="flex flex-col w-full">
        {(!isYou || isAI) && (
          <div
            className={clsx(
              'flex items-center gap-2 mb-1 text-sm',
              {
                'flex-row-reverse': !isAI && isYou,
              },
            )}
          >
            <span className={clsx('font-medium', {
              'text-gray-900': !isYou && !isCorrupted,
              'text-red-700': isCorrupted,
              'text-gray-700': isYou,
            })}
            >
              {isAI ? (isCorrupted ? 'Error' : 'Assistant') : (isYou ? t.messages.you : creator?.email)}
            </span>
            <span className="text-gray-400 text-xs">
              {new Date(createdAt).toLocaleTimeString()}
            </span>
          </div>
        )}

        <div
          className={clsx(
            'relative flex flex-col gap-3',
            {
              'items-end': !isAI && isYou,
              'text-gray-800': !isCorrupted,
              'text-red-800': isCorrupted,
            },
          )}
        >
          <div
            className={clsx('flex items-center gap-2', {
              'items-end': !isAI && isYou,
            })}
          >
            {!readOnly && isYou && !isAI && (
              <button
                type="button"
                onClick={() => onReply(message)}
                className="flex-shrink-0 hover:bg-gray-200 p-1 rounded-full"
              >
                <ReplyIcon size={14} className="text-gray-400" />
              </button>
            )}

            <div className={clsx('flex-1', {
              'rounded-lg bg-gray-50 px-3 py-2': isYou && !isAI,
            })}
            >
              {!isAI && message.repliedMessage && (
                <ChatMessageRepliedMessage
                  message={message.repliedMessage}
                  darkMode={false}
                />
              )}
              <ChatMessageContent
                key={typeof content}
                content={content}
                disabled={!isLast || readOnly}
                darkMode={false}
                showToolbars={isAI}
                onAction={onAction}
              />
            </div>
          </div>

          <div
            className={clsx('flex flex-col gap-3', {
              'items-end w-full': !isAI && isYou,
            })}
          >
            {files.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <FilesCardsList
                  items={pipe(files, pluckTyped('resource'))}
                  itemPropsFn={() => ({
                    limitWidth: true,
                    withBackground: false,
                    compact: true,
                  })}
                />
              </div>
            )}

            {!readOnly && !isYou && (
              <div className="flex justify-between items-center">
                <div className="flex flex-wrap items-center gap-4 w-full">
                  <ToolbarSmallActionButton
                    title={t.actions.reply}
                    icon={<ReplyIcon size={14} className="text-gray-500" />}
                    onClick={() => onReply(message)}
                  />

                  {isAI && (
                    <>
                      <ChatMessageAIActions
                        isLast={isLast}
                        message={message}
                        onRefreshResponse={() => onRefreshResponse(message)}
                      />
                      {repeats.length > 0 && (
                        <ChatMessageVariants
                          {...currentVariant.bind.entire()}
                          total={repeats.length + 1}
                          timestamps={timestamps}
                        />
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
