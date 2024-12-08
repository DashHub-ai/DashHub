import { useMemo } from 'react';

import type { HydrateResult } from './hydrate-result';

import { createHydratePipe, hydrateWithAppChatBadges, hydrateWithChatActions } from './';

type UseContentHydrationProps = {
  content: string;
  darkMode?: boolean;
  onAction?: (action: string) => void;
};

export function useContentHydration({ content, darkMode, onAction }: UseContentHydrationProps): HydrateResult {
  return useMemo(
    () => createHydratePipe(
      hydrateWithChatActions(onAction ?? (() => {}), darkMode),
      hydrateWithAppChatBadges({ darkMode }),
    )(content),
    [content, darkMode, onAction],
  );
}
