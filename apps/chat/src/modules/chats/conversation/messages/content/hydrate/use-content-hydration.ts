import { useMemo } from 'react';

import type { SdkMessageWebSearchItemT } from '@dashhub/sdk';

import { createHydratePipe, type HydrateResult } from './hydrate-result';
import { hydrateWithAppChatBadges } from './hydrate-with-app-chat-badges';
import { type HydratedChatActionsAttrs, hydrateWithChatActions } from './hydrate-with-chat-actions';
import { hydrateWithProjectsEmbeddingsBadges } from './hydrate-with-projects-embeddings-badges';
import { hydrateWithWebSearchBadges } from './hydrate-with-web-search-sources';

type Attrs =
  & Partial<HydratedChatActionsAttrs>
  & {
    content: string;
    searchResults: SdkMessageWebSearchItemT[];
  };

export function useContentHydration({ content, disabled, searchResults, ...attrs }: Attrs): HydrateResult {
  return useMemo(
    () => createHydratePipe(
      hydrateWithChatActions({
        disabled,
        onAction: () => {},
        ...attrs,
      }),
      hydrateWithProjectsEmbeddingsBadges({}),
      hydrateWithAppChatBadges({}),
      hydrateWithWebSearchBadges(searchResults),
    )(content),
    [content, disabled],
  );
}
