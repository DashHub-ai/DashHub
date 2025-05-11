import { useNonRerenderSubscribeStore } from '@dashhub/commons-front';

import {
  type SdkFavoritesSnapshotT,
  useSdkFavoritesContextOrThrow,
} from '../sdk-favorites-context';

export function useSdkNonRerenderSubscribeFavorites(subscriber: (favorites: SdkFavoritesSnapshotT) => void) {
  const store = useSdkFavoritesContextOrThrow();

  return useNonRerenderSubscribeStore(store, subscriber);
}
