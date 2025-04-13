import { pipe } from 'fp-ts/lib/function';
import { type PropsWithChildren, useEffect, useMemo } from 'react';

import { createStoreSubscriber, tapTaskEither } from '@llm/commons';

import { useSdk } from '../hooks';
import { useSdkOptimisticFavoritesCountWatcher } from './hooks';
import { SdkFavoritesContext, type SdkFavoritesContextT, type SdkFavoritesSnapshotT } from './sdk-favorites-context';

export function SdkFavoritesProvider({ children }: PropsWithChildren) {
  const sdk = useSdk();
  const optimisticCountWatcher = useSdkOptimisticFavoritesCountWatcher();

  const store = useMemo<SdkFavoritesContextT | null>(() => {
    if (!sdk.session.isLoggedIn) {
      return null;
    }

    const store = createStoreSubscriber<SdkFavoritesSnapshotT>({
      loading: true,
    });

    const reload = pipe(
      sdk.sdks.dashboard.favorites.all(),
      tapTaskEither(
        (items) => {
          optimisticCountWatcher.reset(items.length);
          store.notify({
            loading: false,
            items,
          });
        },
        () => {
          console.error('Unable to fetch favorites items!');
        },
      ),
    );

    return {
      ...store,
      reload,
    };
  }, [sdk.session.isLoggedIn]);

  useEffect(() => {
    store?.reload();
  }, [sdk.session.isLoggedIn]);

  return (
    <SdkFavoritesContext value={store}>
      {children}
    </SdkFavoritesContext>
  );
}
