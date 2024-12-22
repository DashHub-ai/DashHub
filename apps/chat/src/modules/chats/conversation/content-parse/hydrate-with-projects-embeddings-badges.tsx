import {
  ProjectEmbeddingChatBadge,
  type ProjectEmbeddingChatBadgeProps,
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
    const inlinedReactComponents: HydrateInlinedComponents = {};
    const cleanContent = content.replace(/#embedding:(\d+)/g, (_, id) => {
      inlinedReactComponents[`embedding-${id}`] = (
        <ProjectEmbeddingChatBadge
          key={id}
          id={+id}
          {...props}
        />
      );

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
