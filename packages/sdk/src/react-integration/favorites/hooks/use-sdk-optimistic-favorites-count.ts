import { useMemo } from 'react';
import { z } from 'zod';

import { useLocalStorageObject } from '@llm/commons-front';
import { type SdkFavoriteT, type SdkFavoriteTypeT, SdkFavoriteV } from '~/modules';

import { useSdkOnFavoriteAction } from './use-sdk-on-favorite-action';

function useSdkOptimisticFavoritesStorage(rerenderOnSet: boolean = false) {
  return useLocalStorageObject('optimistic-favorites-count', {
    schema: z.array(SdkFavoriteV).catch([]).default([]),
    readBeforeMount: true,
    forceParseIfNotSet: true,
    rerenderOnSet,
  });
}

export function useSdkOptimisticFavoritesCount(type: SdkFavoriteTypeT) {
  const storage = useSdkOptimisticFavoritesStorage();

  return useMemo(
    () => storage.getOrNull()?.filter(favorite => favorite.type === type).length ?? 0,
    [storage.revision],
  );
};

export function useSdkOptimisticFavoritesWatcher() {
  const storage = useSdkOptimisticFavoritesStorage(false);

  useSdkOnFavoriteAction((action, favorite) => {
    switch (action) {
      case 'pinned-favorite':
        storage.set([...storage.getOrNull() ?? [], favorite]);
        break;

      case 'unpinned-favorite':
        storage.set(
          (storage.getOrNull() ?? []).filter(
            item => item.id !== favorite.id && item.type !== favorite.type,
          ),
        );
        break;
    }
  });

  return {
    reset: (newValue: SdkFavoriteT[]) => {
      storage.set(newValue);
    },
  };
}
