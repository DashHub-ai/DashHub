import { memo, useMemo, useSyncExternalStore } from 'react';
import sanitizeHtml from 'sanitize-html';

import { createStoreSubscriber } from '@llm/commons';

import type { AIStreamContent, AIStreamObservable } from '../hooks';

type Props = {
  content: string | AIStreamObservable;
};

export const ChatMessageContent = memo(({ content }: Props) => {
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

  const sanitizedContent = useMemo(() => sanitizeHtml(stream.content), [stream]);

  return (
    <>
      <p className="text-sm whitespace-pre-wrap">
        {sanitizedContent}
      </p>

      {!stream.done && (
        <div className="flex gap-1 my-2">
          <div className="bg-gray-400 rounded-full w-1 h-1 animate-bounce" />
          <div className="bg-gray-400 rounded-full w-1 h-1 animate-bounce [animation-delay:0.2s]" />
          <div className="bg-gray-400 rounded-full w-1 h-1 animate-bounce [animation-delay:0.4s]" />
        </div>
      )}
    </>
  );
});
