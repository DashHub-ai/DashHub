import type { SdkMessageWebSearchItemT } from '@dashhub/sdk';

import { decodeHtmlEntities } from '@dashhub/commons';
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

    // Parse Markdown links with support for nested parentheses
    let result = '';
    let i = 0;

    while (i < content.length) {
      if (content[i] === '[') {
        const linkStart = i;
        i++;

        // Find title part
        let title = '';
        let bracketDepth = 1;

        while (i < content.length && bracketDepth > 0) {
          if (content[i] === '[') {
            bracketDepth++;
          }

          if (content[i] === ']') {
            bracketDepth--;
          }

          if (bracketDepth > 0) {
            title += content[i];
          }

          i++;
        }

        // Check if we have a URL part
        if (i < content.length && content[i] === '(') {
          i++;

          // Find URL part (handling nested parentheses)
          let url = '';
          let parenDepth = 1;

          while (i < content.length && parenDepth > 0) {
            if (content[i] === '(') {
              parenDepth++;
            }

            if (content[i] === ')') {
              parenDepth--;
            }

            if (parenDepth > 0) {
              url += content[i];
            }

            i++;
          }

          const decodedUrl = decodeHtmlEntities(url);
          const searchResult = searchResults.find(item => item.url === decodedUrl);

          if (searchResult) {
            const componentId = `websearch-${componentCounter++}`;
            inlinedReactComponents[componentId] = (
              <WebSearchChatBadge
                key={componentId}
                item={searchResult}
                title={title}
              />
            );
            result += inlineReactComponentTag(componentId);
            continue;
          }
        }

        // If no match, add the original text
        result += content.slice(linkStart, i);
      }
      else {
        result += content[i];
        i++;
      }
    }

    return {
      content: result.trim(),
      prependToolbars: [],
      appendToolbars: [],
      inlinedReactComponents,
    };
  };
}
