import { Fragment, type ReactNode } from 'react';

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
      return <Fragment key={token}>{token}</Fragment>;
    }

    const [, id] = match;
    return (
      <Fragment key={id}>
        <AppChatBadge id={+id} {...props} className="mx-1 my-1 first:ml-0" />
      </Fragment>
    );
  });
}
