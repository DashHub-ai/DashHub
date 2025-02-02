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
  const timestamps = [message.createdAt, ...repeats.map(r => r.createdAt)];
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
        'flex items-start gap-2 px-4 py-2',
        'animate-messageSlideIn',
        {
          'mb-5': !repeats.length,
          'mb-10': repeats.length,
          'opacity-75': readOnly && archived,
          'opacity-0': !readOnly || !archived,
        },
      )}
    >
      <div
        className={clsx(
          'flex flex-shrink-0 justify-center items-center border rounded-full w-8 h-8',
          {
            'bg-blue-50 border-blue-200': isAI,
            'bg-gray-100 border-gray-200': !isAI,
            'opacity-75': readOnly && archived,
          },
        )}
      >
        {isAI
          ? <Bot className="w-5 h-5 text-blue-600" />
          : <User className="w-5 h-5 text-gray-600" />}
      </div>

      <div className="flex flex-col w-full">
        <div className="flex items-center gap-2 mb-1 text-sm">
          <span className="font-medium text-gray-900">
            {isAI ? 'Assistant' : (isYou ? t.messages.you : creator?.email)}
          </span>
          <span className="text-gray-400 text-xs">
            {new Date(createdAt).toLocaleTimeString()}
          </span>
        </div>

        <div className="relative flex flex-col gap-3 text-gray-800">
          {!isAI && message.repliedMessage && (
            <div className="mb-1">
              <ChatMessageRepliedMessage
                message={message.repliedMessage}
                darkMode={false}
              />
            </div>
          )}

          <ChatMessageContent
            key={typeof content}
            content={content}
            disabled={!isLast || readOnly}
            darkMode={false}
            showToolbars={isAI}
            onAction={onAction}
          />

          {/* Message footer section */}
          <div className="flex flex-col gap-3">
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

            {!readOnly && (
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4 w-full">
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
