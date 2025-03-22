import { createContext } from 'react';

import type { StoreSubscriber } from '@llm/commons';
import type { FavoritesSdk, SdkFavoriteT } from '~/modules';

import { useContextOrThrow } from '@llm/commons-front';

export type SdkFavoritesSnapshotT =
  | { loading: true; }
  | { loading: false; items: SdkFavoriteT[]; };

export type SdkFavoritesContextT =
  & StoreSubscriber<SdkFavoritesSnapshotT>
  & {
    reload: ReturnType<FavoritesSdk['all']>;
  };

export const SdkFavoritesContext = createContext<SdkFavoritesContextT | null>(null);

export const useSdkFavoritesContextOrThrow = () => useContextOrThrow(SdkFavoritesContext, 'Missing SDK Favorites context in tree!');
