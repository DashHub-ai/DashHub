import type { ReactNode } from 'react';

import { AppChatBadge, type AppChatBadgeProps } from './app-chat-badge';

export function hydrateWithAppChatBadges(
  content: string,
  props: Omit<AppChatBadgeProps, 'id'> = {},
): ReactNode {
  const tokens = content.split(/(#app:\d+)/);

  return tokens.map((token) => {
    const match = token.match(/#app:(\d+)/);
    if (!match?.length) {
      return token;
    }

    const [, id] = match;
    return <AppChatBadge key={id} id={+id} {...props} />;
  });
}
