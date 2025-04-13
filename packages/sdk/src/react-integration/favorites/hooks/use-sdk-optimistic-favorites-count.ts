import { z } from 'zod';

import { useLocalStorageObject } from '@llm/commons-front';

import { useSdkOnFavoriteAction } from './use-sdk-on-favorite-action';

function useSdkOptimisticFavoritesCountStorage(rerenderOnSet: boolean = false) {
  return useLocalStorageObject('optimistic-favorites-count', {
    schema: z.number().default(0).catch(0),
    readBeforeMount: true,
    forceParseIfNotSet: true,
    rerenderOnSet,
  });
}

export function useSdkOptimisticFavoritesCount() {
  const storage = useSdkOptimisticFavoritesCountStorage();

  return storage.getOrNull() ?? 0;
};

export function useSdkOptimisticFavoritesCountWatcher() {
  const storage = useSdkOptimisticFavoritesCountStorage(false);

  useSdkOnFavoriteAction((action) => {
    switch (action) {
      case 'pinned-favorite':
        storage.set(Math.max(0, (storage.getOrNull() ?? 0) + 1));
        break;

      case 'unpinned-favorite':
        storage.set(Math.max((storage.getOrNull() ?? 0) - 1, 0));
        break;
    }
  });

  return {
    reset: (newValue: number) => {
      storage.set(newValue);
    },
  };
}
