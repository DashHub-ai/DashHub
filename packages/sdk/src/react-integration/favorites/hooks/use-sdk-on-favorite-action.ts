import type { SdkUpsertFavoriteInputT } from '~/modules';

import { useWindowListener } from '@llm/commons-front';

export function useSdkOnFavoriteAction(
  onHandle: (action: FavoriteActionName, favorite: SdkUpsertFavoriteInputT) => void,
) {
  useWindowListener({
    'pinned-favorite': ({ favorite }: FavoriteActionEvent) => {
      onHandle('pinned-favorite', favorite);
    },

    'unpinned-favorite': ({ favorite }: FavoriteActionEvent) => {
      onHandle('unpinned-favorite', favorite);
    },
  });
}

export class FavoriteActionEvent extends Event {
  constructor(
    name: FavoriteActionName,
    public readonly favorite: SdkUpsertFavoriteInputT,
  ) {
    super(name);
  }
}

export type FavoriteActionName =
  | 'pinned-favorite'
  | 'unpinned-favorite';
