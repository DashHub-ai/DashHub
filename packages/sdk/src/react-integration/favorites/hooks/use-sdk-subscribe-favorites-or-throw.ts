import { useSyncExternalStore } from 'react';

import { useSdkFavoritesContextOrThrow } from '../sdk-favorites-context';

export function useSdkSubscribeFavoritesOrThrow() {
  const store = useSdkFavoritesContextOrThrow();

  return useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot,
  );
}
