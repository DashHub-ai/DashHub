import type { SdkTableRowIdT } from '@dashhub/sdk';

import {
  ProjectEmbeddingChatBadge,
  type ProjectEmbeddingChatBadgeProps,
} from '~/modules/chats/content-badges';

import {
  type ContentHydrator,
  type HydrateInlinedComponents,
  inlineReactComponentTag,
} from './hydrate-result';

export function hydrateWithProjectsEmbeddingsBadges(
  props: Omit<ProjectEmbeddingChatBadgeProps, 'id' | 'className'> = {},
): ContentHydrator {
  return (content: string) => {
    const embeddingIds: SdkTableRowIdT[] = [];
    const inlinedReactComponents: HydrateInlinedComponents = {};

    const cleanContent = content.replace(/#embedding:(\d+)/g, (_, id) => {
      inlinedReactComponents[`embedding-${id}`] = (
        <ProjectEmbeddingChatBadge
          key={id}
          id={+id}
          {...props}
        />
      );

      embeddingIds.push(+id);

      return inlineReactComponentTag(`embedding-${id}`);
    });

    return {
      content: cleanContent.trim(),
      prependToolbars: [],
      appendToolbars: [],
      inlinedReactComponents,
    };
  };
}
