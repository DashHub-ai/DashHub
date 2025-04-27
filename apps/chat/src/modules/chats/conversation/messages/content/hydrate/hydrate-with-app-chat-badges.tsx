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

    return {
      content: cleanContent.trim(),
      prependToolbars: rejectFalsyItems(badges),
      appendToolbars: [],
    };
  };
}
