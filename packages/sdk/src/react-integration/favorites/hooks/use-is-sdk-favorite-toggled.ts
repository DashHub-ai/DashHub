import { useMemo } from 'react';

import type { SdkFavoriteT } from '~/modules/dashboard/favorites';

import { useSdkSubscribeFavoritesOrThrow } from './use-sdk-subscribe-favorites-or-throw';

export function useIsSdkFavoriteToggled(favorite: SdkFavoriteT) {
  const data = useSdkSubscribeFavoritesOrThrow();

  return useMemo(() => {
    if (data.loading) {
      return null;
    }

    return data.items.some(
      item =>
        favorite.type === item.type
        && favorite.id === item.id,
    );
  }, [data, favorite.type, favorite.id]);
}
