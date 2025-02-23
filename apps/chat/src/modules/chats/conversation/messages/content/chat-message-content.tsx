import clsx from 'clsx';
import { memo, useMemo, useSyncExternalStore } from 'react';
import sanitizeHtml from 'sanitize-html';

import type { SdkMessageWebSearchItemT } from '@llm/sdk';

import { createStoreSubscriber, truncateText } from '@llm/commons';

import type { AIStreamContent, AIStreamObservable } from '../../hooks';

import { MessageMarkdown, useContentHydration } from './parser';

type Props = {
  content: string | AIStreamObservable;
  searchResults: SdkMessageWebSearchItemT[];
  truncate?: number;
  disabled?: boolean;
  showToolbars?: boolean;
  className?: string;
  textClassName?: string;
  onAction?: (action: string) => void;
};

export const ChatMessageContent = memo((
  {
    content,
    searchResults,
    truncate,
    disabled,
    showToolbars = true,
    className,
    textClassName,
    onAction,
  }: Props,
) => {
  const observable = useMemo(() => {
    if (typeof content === 'string') {
      return createStoreSubscriber<AIStreamContent>({
        content,
        done: true,
        error: false,
        message: null,
        abortController: new AbortController(),
      });
    }

    return content;
  }, [content]);

  const stream = useSyncExternalStore(
    observable.subscribe,
    observable.getSnapshot,
    observable.getSnapshot,
  );

  const isStreaming = typeof content !== 'string';
  const sanitizedContent = useMemo(() => {
    const html = sanitizeHtml(stream.content);

    if (truncate) {
      return truncateText(truncate, '...')(html);
    }

    return html;
  }, [stream, truncate]);

  const hydrationResult = useContentHydration({
    disabled,
    content: sanitizedContent,
    searchResults,
    onAction,
  });

  return (
    <div className={className}>
      {!truncate && showToolbars && hydrationResult.prependToolbars}

      <div className={clsx('max-w-[800px]', textClassName)}>
        <MessageMarkdown
          content={hydrationResult.content}
          inlinedReactComponents={hydrationResult.inlinedReactComponents}
        />
      </div>

      {!truncate && showToolbars && !isStreaming && hydrationResult.appendToolbars}

      {!stream.done && (
        <div className="flex gap-1 my-2">
          <div className="bg-gray-400 rounded-full w-1 h-1 animate-bounce" />
          <div className="bg-gray-400 rounded-full w-1 h-1 animate-bounce [animation-delay:0.2s]" />
          <div className="bg-gray-400 rounded-full w-1 h-1 animate-bounce [animation-delay:0.4s]" />
        </div>
      )}
    </div>
  );
});
