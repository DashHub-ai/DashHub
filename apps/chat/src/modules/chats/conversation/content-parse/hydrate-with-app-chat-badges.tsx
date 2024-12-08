import type { ReactNode } from 'react';

import { rejectFalsyItems } from '@llm/commons';
import { AppChatBadge, type AppChatBadgeProps } from '~/modules/apps/chat/app-chat-badge';

import type { ContentHydrator } from './hydrate-result';

export function hydrateWithAppChatBadges(
  props: Omit<AppChatBadgeProps, 'id' | 'className'> = {},
): ContentHydrator {
  return (content: string) => {
    const badges: ReactNode[] = [];
    const cleanContent = content.replace(/#app:(\d+)/g, (_, id) => {
      badges.push(
        <AppChatBadge
          key={id}
          id={+id}
          {...props}
        />,
      );
      return '';
    });

    const badgesToolbar = badges.length
      ? (
          <div key="badges-toolbar" className="flex flex-wrap gap-1 mb-2">
            {badges}
          </div>
        )
      : null;

    return {
      content: cleanContent.trim(),
      prependToolbars: rejectFalsyItems([badgesToolbar]),
      appendToolbars: [],
    };
  };
}
