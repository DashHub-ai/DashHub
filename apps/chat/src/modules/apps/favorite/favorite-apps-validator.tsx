import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { useEffect } from 'react';

import { pluckTyped, runTask, tapTaskEither } from '@llm/commons';
import { useInterval } from '@llm/commons-front';
import { useSdk } from '@llm/sdk';

import { useFavoriteApps } from './use-favorite-apps';

export function FavoriteAppsValidator() {
  const { ids, set } = useFavoriteApps();
  const { session, sdks } = useSdk();

  const refreshFavorites = () => {
    if (!session.isLoggedIn || !ids.length) {
      return;
    }

    void pipe(
      sdks.dashboard.apps.search({
        ids,
        limit: ids.length,
        offset: 0,
        archived: false,
        sort: 'id:asc',
      }),
      TE.map(({ items }) => items.filter(app => ids.includes(app.id))),
      TE.map(pluckTyped('id')),
      TE.mapLeft(() => []),
      tapTaskEither((newIds) => {
        if (ids.length !== newIds.length) {
          set(newIds);
        }
      }),
      runTask,
    );
  };

  useEffect(refreshFavorites, [session.isLoggedIn]);
  useInterval(refreshFavorites, 60_000);

  return null;
}
