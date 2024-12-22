import type { ReactNode } from 'react';

export type HydrateInlinedComponents = Record<string, ReactNode>;

export type HydrateResult = {
  content: string;
  prependToolbars: ReactNode[];
  appendToolbars: ReactNode[];
  inlinedReactComponents?: HydrateInlinedComponents;
};

export type ContentHydrator = (content: string) => HydrateResult;

export function createHydratePipe(...hydrators: ContentHydrator[]): ContentHydrator {
  return (initialContent: string) =>
    hydrators.reduce<HydrateResult>(
      (result, hydrator) => {
        const nextResult = hydrator(result.content);

        return {
          content: nextResult.content,
          prependToolbars: [
            ...result.prependToolbars,
            ...nextResult.prependToolbars,
          ],
          appendToolbars: [
            ...result.appendToolbars,
            ...nextResult.appendToolbars,
          ],
          inlinedReactComponents: {
            ...result.inlinedReactComponents,
            ...nextResult.inlinedReactComponents,
          },
        };
      },
      {
        content: initialContent,
        prependToolbars: [],
        appendToolbars: [],
        inlinedReactComponents: {},
      },
    );
}

export function inlineReactComponentTag(key: string): string {
  return `[$embed](react$${key})`;
}
