import type { ReactNode } from 'react';

export type HydrateResult = {
  content: string;
  prependToolbars: ReactNode[];
  appendToolbars: ReactNode[];
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
        };
      },
      {
        content: initialContent,
        prependToolbars: [],
        appendToolbars: [],
      },
    );
}
