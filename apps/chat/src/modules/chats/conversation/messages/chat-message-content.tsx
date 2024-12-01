import { memo, useMemo, useSyncExternalStore } from 'react';
import sanitizeHtml from 'sanitize-html';

import { createStoreSubscriber, truncateText } from '@llm/commons';
import { hydrateWithAppChatBadges } from '~/modules/apps';

import type { AIStreamContent, AIStreamObservable } from '../hooks';

type Props = {
  content: string | AIStreamObservable;
  truncate?: number;
  darkMode?: boolean;
};

export const ChatMessageContent = memo(({ content, truncate, darkMode }: Props) => {
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

  const sanitizedContent = useMemo(() => {
    const html = sanitizeHtml(stream.content);

    if (truncate) {
      return truncateText(truncate, '...')(html);
    }

    return html;
  }, [stream, truncate]);

  const hydratedContent = useMemo(
    () => hydrateWithAppChatBadges(sanitizedContent, { darkMode }),
    [sanitizedContent, darkMode],
  );

  return (
    <>
      <p className="text-sm whitespace-pre-wrap">
        {hydratedContent}
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
