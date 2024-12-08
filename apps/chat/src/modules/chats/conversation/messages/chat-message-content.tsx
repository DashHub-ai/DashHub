import { memo, useMemo, useSyncExternalStore } from 'react';
import sanitizeHtml from 'sanitize-html';

import { createStoreSubscriber, truncateText } from '@llm/commons';

import type { AIStreamContent, AIStreamObservable } from '../hooks';

import {
  createHydratePipe,
  hydrateWithAppChatBadges,
  hydrateWithChatActions,
  MessageMarkdown,
} from '../content-parse';

type Props = {
  content: string | AIStreamObservable;
  truncate?: number;
  darkMode?: boolean;
  onAction?: (action: string) => void;
};

export const ChatMessageContent = memo(({ content, truncate, darkMode, onAction }: Props) => {
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

  const hydrationResult = useMemo(
    () => createHydratePipe(
      hydrateWithChatActions(onAction ?? (() => {}), darkMode),
      hydrateWithAppChatBadges({ darkMode }),
    )(sanitizedContent),
    [sanitizedContent, darkMode, onAction],
  );

  return (
    <div className="text-sm">
      {hydrationResult.prependToolbars}

      <MessageMarkdown content={hydrationResult.content} />

      {hydrationResult.appendToolbars}

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
