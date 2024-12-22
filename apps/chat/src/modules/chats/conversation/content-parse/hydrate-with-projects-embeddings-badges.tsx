import type { ReactNode } from 'react';

import {
  ProjectEmbeddingChatBadge,
  type ProjectEmbeddingChatBadgeProps,
  ProjectImageChatBadge,
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
    const maybeImages: ReactNode[] = [];
    const inlinedReactComponents: HydrateInlinedComponents = {};

    const cleanContent = content.replace(/#embedding:(\d+)/g, (_, id) => {
      inlinedReactComponents[`embedding-${id}`] = (
        <ProjectEmbeddingChatBadge
          key={id}
          id={+id}
          {...props}
        />
      );

      maybeImages.push(
        <ProjectImageChatBadge key={id} id={+id} />,
      );

      return inlineReactComponentTag(`embedding-${id}`);
    });

    const appendToolbars = maybeImages.length > 0
      ? [
          <div
            key="images-container"
            className="flex flex-row flex-wrap gap-4 empty:hidden my-4 mb-5"
          >
            {maybeImages.slice(-1)[0]}
          </div>,
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
