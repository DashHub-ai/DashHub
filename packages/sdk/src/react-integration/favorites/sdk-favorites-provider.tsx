import { pipe } from 'fp-ts/lib/function';
import { type PropsWithChildren, useEffect, useMemo } from 'react';

import type { SdkTableRowIdT } from '~/shared';

import { createStoreSubscriber, type Nullable, tapTaskEither } from '@llm/commons';

import { useSdk } from '../hooks';
import { useSdkOptimisticFavoritesWatcher } from './hooks';
import { SdkFavoritesContext, type SdkFavoritesContextT, type SdkFavoritesSnapshotT } from './sdk-favorites-context';

type Props = PropsWithChildren & {
  organizationId?: Nullable<SdkTableRowIdT>;
};

export function SdkFavoritesProvider({ children, organizationId }: Props) {
  const sdk = useSdk();
  const optimisticCountWatcher = useSdkOptimisticFavoritesWatcher();

  const store = useMemo<SdkFavoritesContextT | null>(() => {
    if (!sdk.session.isLoggedIn) {
      optimisticCountWatcher.reset([]);
      return null;
    }

    const store = createStoreSubscriber<SdkFavoritesSnapshotT>({
      loading: true,
    });

    const reload = pipe(
      sdk.sdks.dashboard.favorites.all({ organizationId }),
      tapTaskEither(
        (items) => {
          optimisticCountWatcher.reset(items);
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
  }, [sdk.session.isLoggedIn, organizationId]);

  useEffect(() => {
    store?.reload();
  }, [sdk.session.isLoggedIn, organizationId]);

  return (
    <SdkFavoritesContext value={store}>
      {children}
    </SdkFavoritesContext>
  );
}
