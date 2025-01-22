import { memo, useMemo, useSyncExternalStore } from 'react';
import sanitizeHtml from 'sanitize-html';

import { createStoreSubscriber, truncateText } from '@llm/commons';

import type { AIStreamContent, AIStreamObservable } from '../hooks';

import { MessageMarkdown, useContentHydration } from '../content-parse';

type Props = {
  content: string | AIStreamObservable;
  truncate?: number;
  darkMode?: boolean;
  disabled?: boolean;
  showToolbars?: boolean;
  onAction?: (action: string) => void;
};

export const ChatMessageContent = memo(({ content, truncate, disabled, darkMode, showToolbars = true, onAction }: Props) => {
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
    darkMode,
    onAction,
  });

  return (
    <div className="text-sm">
      {!truncate && showToolbars && hydrationResult.prependToolbars}

      <div className="max-w-[650px] overflow-auto">
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
