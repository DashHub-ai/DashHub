import type { SdkTableRowIdT } from '@llm/sdk';

import {
  ProjectEmbeddingChatBadge,
  type ProjectEmbeddingChatBadgeProps,
  ProjectImagesChatBadge,
} from '~/modules/projects-embeddings';

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

    const appendToolbars = embeddingIds.length > 0
      ? [
          <ProjectImagesChatBadge key="project-images-chat-badge" ids={embeddingIds} />,
        ]
      : [];

    return {
      content: cleanContent.trim(),
      prependToolbars: [],
      appendToolbars,
      inlinedReactComponents,
    };
  };
}
