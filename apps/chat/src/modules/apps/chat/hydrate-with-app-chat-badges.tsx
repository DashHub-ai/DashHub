import type { ReactNode } from 'react';

import clsx from 'clsx';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { AppChatBadge, type AppChatBadgeProps } from './app-chat-badge';

export function hydrateWithAppChatBadges(
  content: string,
  props: Omit<AppChatBadgeProps, 'id' | 'className'> = {},
): ReactNode {
  const tokens = content.split(/(#app:\d+)/);

  return tokens.map((token) => {
    const match = token.match(/#app:(\d+)/);

    if (!token.trim().length) {
      return null;
    }

    if (!match?.length) {
      return (
        <Markdown
          key={token}
          className={clsx(
            'prose-table:border-collapse prose-td:border-gray-300 prose-th:border-gray-300 prose-td:p-2 prose-th:p-2 prose-td:border prose-th:border',
            'prose-a:underline prose-code:overflow-auto prose-pre:overflow-auto',
            'prose-ol:list-decimal chat-markdown prose-sm',
          )}
          remarkPlugins={[remarkGfm]}
        >
          {token}
        </Markdown>
      );
    }

    const [, id] = match;

    return (
      <AppChatBadge key={id} id={+id} {...props} className="mx-1 my-1 first:mb-2 first:ml-0" />
    );
  });
}
