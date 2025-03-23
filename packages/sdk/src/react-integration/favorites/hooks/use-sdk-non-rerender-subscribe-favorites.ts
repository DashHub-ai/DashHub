import { useNonRerenderSubscribeStore } from '@llm/commons-front';

import {
  type SdkFavoritesSnapshotT,
  useSdkFavoritesContextOrThrow,
} from '../sdk-favorites-context';

export function useSdkNonRerenderSubscribeFavorites(subscriber: (favorites: SdkFavoritesSnapshotT) => void) {
  const store = useSdkFavoritesContextOrThrow();

  return useNonRerenderSubscribeStore(store, subscriber);
}
