import clsx from 'clsx';
import { Bot } from 'lucide-react';
import { useMemo, useSyncExternalStore } from 'react';
import sanitizeHtml from 'sanitize-html';

import type { AIStreamObservable } from '../hooks';

type Props = {
  observable: AIStreamObservable;
};

export function ChatAIStreamMessage({ observable }: Props) {
  const stream = useSyncExternalStore(
    observable.subscribe,
    observable.getSnapshot,
    observable.getSnapshot,
  );

  const sanitizedContent = useMemo(() => sanitizeHtml(stream.content), [stream]);

  if (stream.done) {
    return null;
  }

  return (
    <div className="flex items-start gap-2 mb-6 animate-slideIn">
      <div className="flex flex-shrink-0 justify-center items-center border-gray-200 bg-gray-100 border rounded-full w-8 h-8">
        <Bot className="w-5 h-5 text-gray-600" />
      </div>

      <div
        className={clsx(
          'relative px-4 py-2 border rounded-2xl min-w-[30%] max-w-[70%]',
          'before:absolute before:top-[12px] before:border-8 before:border-transparent before:border-t-8',
          'bg-gray-100 before:border-gray-100 before:left-[-8px] border-gray-200 before:border-l-0 before:border-r-[12px]',
        )}
      >
        <p className="text-sm whitespace-pre-wrap">{sanitizedContent}</p>

        {!stream.done && (
          <div className="flex gap-1 my-2">
            <div className="bg-gray-400 rounded-full w-1 h-1 animate-bounce" />
            <div className="bg-gray-400 rounded-full w-1 h-1 animate-bounce [animation-delay:0.2s]" />
            <div className="bg-gray-400 rounded-full w-1 h-1 animate-bounce [animation-delay:0.4s]" />
          </div>
        )}
      </div>
    </div>
  );
}
