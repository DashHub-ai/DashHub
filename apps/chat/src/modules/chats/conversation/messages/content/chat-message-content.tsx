import clsx from 'clsx';
import { memo, type ReactNode, useMemo, useSyncExternalStore } from 'react';

import type { SdkMessageWebSearchItemT } from '@dashhub/sdk';

import { createStoreSubscriber, truncateText } from '@dashhub/commons';

import type { AIStreamContent, AIStreamObservable } from '../../hooks';

import { ChatMessageMarkdown } from './chat-message-markdown';
import { useContentHydration } from './hydrate';
import { sanitizeContentPreservingCodeBlocks } from './sanitize-content-preserving-code-blocks';

type Props = {
  content: string | AIStreamObservable;
  searchResults: SdkMessageWebSearchItemT[];
  truncate?: number;
  disabled?: boolean;
  showToolbars?: boolean;
  appendToolbars?: ReactNode[];
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
    appendToolbars,
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
    const html = sanitizeContentPreservingCodeBlocks(stream.content);

    if (truncate) {
      return truncateText(truncate, '...')(html);
    }

    return html;
  }, [stream.content, truncate]);

  const hydrationResult = useContentHydration({
    disabled,
    content: sanitizedContent,
    searchResults,
    onAction,
  });

  return (
    <div className={className}>
      {!truncate && showToolbars && (!!appendToolbars?.length || !!hydrationResult.prependToolbars.length) && (
        <div key="badges-toolbar" className="flex flex-wrap gap-1 mt-1 mb-2">
          {hydrationResult.prependToolbars}
          {appendToolbars}
        </div>
      )}

      <div className={clsx('max-w-[750px]', textClassName)}>
        <ChatMessageMarkdown
          content={hydrationResult.content}
          inlinedReactComponents={hydrationResult.inlinedReactComponents}
          isStreaming={isStreaming}
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
