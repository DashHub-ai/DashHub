import { useMemo } from 'react';

import { createHydratePipe, type HydrateResult } from './hydrate-result';
import { hydrateWithAppChatBadges } from './hydrate-with-app-chat-badges';
import { type HydratedChatActionsAttrs, hydrateWithChatActions } from './hydrate-with-chat-actions';

type Attrs =
  & Partial<HydratedChatActionsAttrs>
  & {
    content: string;
  };

export function useContentHydration({ darkMode, content, disabled, ...attrs }: Attrs): HydrateResult {
  return useMemo(
    () => createHydratePipe(
      hydrateWithChatActions({
        darkMode,
        disabled,
        onAction: () => {},
        ...attrs,
      }),
      hydrateWithAppChatBadges({ darkMode }),
    )(content),
    [content, disabled, darkMode],
  );
}