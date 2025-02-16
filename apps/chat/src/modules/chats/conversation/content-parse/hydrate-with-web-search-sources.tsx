import type { SdkMessageWebSearchItemT } from '@llm/sdk';

import { WebSearchChatBadge } from '~/modules/chats/content-badges';

import {
  type ContentHydrator,
  type HydrateInlinedComponents,
  inlineReactComponentTag,
} from './hydrate-result';

export function hydrateWithWebSearchBadges(
  searchResults: SdkMessageWebSearchItemT[],
): ContentHydrator {
  return (content: string) => {
    const inlinedReactComponents: HydrateInlinedComponents = {};
    let componentCounter = 0;

    // Match Markdown links: [title](url)
    const cleanContent = content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, title, url) => {
      const searchResult = searchResults.find(item => item.url === url);

      if (!searchResult) {
        return match;
      }

      const componentId = `websearch-${componentCounter++}`;

      inlinedReactComponents[componentId] = (
        <WebSearchChatBadge
          key={componentId}
          item={searchResult}
          title={title}
        />
      );

      return inlineReactComponentTag(componentId);
    });

    return {
      content: cleanContent.trim(),
      prependToolbars: [],
      appendToolbars: [],
      inlinedReactComponents,
    };
  };
}
