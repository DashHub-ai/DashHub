import type { ReactNode } from 'react';

import { useControl } from '@under-control/forms';
import clsx from 'clsx';
import { takeRight } from 'fp-ts/lib/Array';
import { pipe } from 'fp-ts/lib/function';
import { AlertCircle, Bookmark, Bot, Globe, ReplyIcon, User } from 'lucide-react';

import { type Overwrite, pluckTyped, uniq } from '@llm/commons';
import {
  type SdkRepeatedMessageLike,
  type SdkSearchMessageItemT,
  useIsSdkPinnedMessageToggled,
  useSdkForLoggedIn,
} from '@llm/sdk';
import { useI18n } from '~/i18n';
import { ExternalApiChatBadge } from '~/modules/ai-external-apis/chat';

import type { AIStreamObservable } from '../hooks';

import { FilesCardsList } from '../files';
import {
  ChatMessageAIActions,
  ChatMessagePinAction,
  ChatMesssageCopyAction,
} from './actions';
import { ToolbarSmallActionButton } from './buttons';
import { ChatMessageRepliedMessage } from './chat-message-replied-message';
import { ChatMessageVariants } from './chat-message-variants';
import { ChatMessageContent } from './content';

export type SdkRepeatedMessageItemT = SdkRepeatedMessageLike<
  Overwrite<SdkSearchMessageItemT, {
    content: string | AIStreamObservable;
    isPinned?: boolean;
  }>
>;

type Props = {
  className?: string;
  message: SdkRepeatedMessageItemT;
  actionsToolbar?: ReactNode;
  showAnim?: boolean;
  isLast?: boolean;
  readOnly?: boolean;
  archived?: boolean;
  showToolbars?: boolean;
  showAvatar?: boolean;
  onRefreshResponse?: (message: Omit<SdkRepeatedMessageItemT, 'content'>) => void;
  onReply?: (message: SdkRepeatedMessageItemT) => void;
  onAction?: (action: string) => void;
};

export function ChatMessage(
  {
    className,
    showAnim = true,
    archived,
    message,
    actionsToolbar,
    isLast,
    readOnly,
    showAvatar = true,
    showToolbars = true,
    onRefreshResponse,
    onReply,
    onAction,
  }: Props,
) {
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
  const isPinned = useIsSdkPinnedMessageToggled(message.id);

  const isCorrupted = message.corrupted;
  const hasWebSearch = message.webSearch?.enabled;

  const asyncFunctionToolbars = pipe(
    message.asyncFunctionsResults.map(api => (
      <ExternalApiChatBadge key={api.externalApiId} id={api.externalApiId} />
    )),
    uniq,
  );

  return (
    <div
      className={clsx(
        'flex items-start gap-4',
        showAnim && 'animate-messageSlideIn',
        {
          'mb-6': !repeats.length,
          'mb-8': repeats.length,
          'opacity-75': readOnly && archived,
          'opacity-0': showAnim && (!readOnly || !archived),
          'flex-row-reverse': showAnim && (!isAI && isYou),
          'pl-4 border-l-4 border-purple-300': isPinned,
        },
        className,
      )}
    >
      {showAvatar && (!isYou || isAI) && (
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
              'flex items-center gap-2 mb-2 text-sm',
              {
                'flex-row-reverse': !isAI && isYou,
              },
            )}
          >
            <span
              className={clsx('flex items-center gap-2 font-medium', {
                'text-gray-900': !isYou && !isCorrupted,
                'text-red-700': isCorrupted,
                'text-gray-700': isYou,
              })}
            >
              {isAI ? (isCorrupted ? 'Error' : 'Assistant') : (isYou ? t.messages.you : creator?.email)}
              {hasWebSearch && (
                <span className="inline-flex items-center gap-1 bg-blue-100 px-1.5 py-0.5 rounded-full text-blue-700 text-xs">
                  <Globe size={12} />
                  {t.messages.webSearch}
                </span>
              )}
              {isPinned && (
                <span className="inline-flex items-center gap-1 bg-purple-100 px-1.5 py-0.5 rounded-full text-purple-700 text-xs">
                  <Bookmark size={12} />
                  {t.messages.saved}
                </span>
              )}
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
              'border-l-2 border-blue-200 pl-4': isAI && hasWebSearch,
            },
          )}
        >
          <div
            className={clsx('flex items-center gap-2', {
              'items-end': !isAI && isYou,
            })}
          >
            {!readOnly && isYou && !isAI && onReply && (
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
                <ChatMessageRepliedMessage message={message.repliedMessage} />
              )}

              <ChatMessageContent
                key={typeof content}
                content={content}
                disabled={!isLast || readOnly}
                showToolbars={showToolbars && isAI}
                searchResults={message.webSearch.results ?? []}
                appendToolbars={asyncFunctionToolbars}
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
                  {onReply && (
                    <ToolbarSmallActionButton
                      title={t.actions.reply}
                      icon={<ReplyIcon size={14} className="text-gray-500" />}
                      onClick={() => onReply(message)}
                    />
                  )}

                  <ChatMesssageCopyAction content={content} />

                  <ChatMessagePinAction messageId={message.id} />

                  {actionsToolbar}

                  {isAI && (
                    <>
                      {onRefreshResponse && (
                        <ChatMessageAIActions
                          isLast={!!isLast}
                          message={message}
                          onRefreshResponse={() => onRefreshResponse(message)}
                        />
                      )}

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
