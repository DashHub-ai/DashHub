import { array as A, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { useRef, useState } from 'react';

import type { SdkFavoriteT, SdkUpsertFavoriteInputT } from '~/modules';

import { isNil, TaggedError, tapTaskEither, tapTaskEitherError } from '@llm/commons';
import { useSdkForLoggedIn } from '~/react-integration/hooks';

import { useSdkFavoritesContextOrThrow } from '../sdk-favorites-context';

export class SdkFavoritesStillLoadingError extends TaggedError.ofLiteral()('favorites-list-still-loading') {}

export function useSdkToggleFavorite() {
  const store = useSdkFavoritesContextOrThrow();
  const { sdks } = useSdkForLoggedIn();

  const currentMigrationId = useRef<string | null>(null);
  const [loading, setLoading] = useState(false);

  const optimisticUpdate = (
    {
      optimisticUpdateFn,
      asyncExecutor,
    }: {
      optimisticUpdateFn: (initialMessages: SdkFavoriteT[]) => SdkFavoriteT[];
      asyncExecutor: () => TE.TaskEither<TaggedError<string>, unknown>;
    },
  ) => pipe(
    TE.Do,
    TE.bind('migrationId', () => TE.fromIO(() => {
      currentMigrationId.current = Date.now().toString();
      setLoading(true);

      return currentMigrationId.current;
    })),
    TE.bindW('initialMessages', () => {
      const snapshot = store.getSnapshot();

      if (snapshot.loading) {
        return TE.left(new SdkFavoritesStillLoadingError({}));
      }

      return TE.right(snapshot.items);
    }),
    tapTaskEither(({ initialMessages }) => {
      store.notify({
        loading: false,
        items: optimisticUpdateFn(initialMessages),
      });
    }),
    TE.bindW('result', ({ migrationId, initialMessages }) => pipe(
      asyncExecutor(),
      TE.chainW(() => sdks.dashboard.favorites.all()),
      tapTaskEither((newItems) => {
        if (currentMigrationId.current !== migrationId) {
          return;
        }

        store.notify({
          loading: false,
          items: newItems,
        });

        setLoading(false);
      }),
      tapTaskEitherError((error) => {
        console.error(error);

        store.notify({
          loading: false,
          items: initialMessages,
        });

        setLoading(false);
      }),
    )),
  );

  const pin = (dto: SdkUpsertFavoriteInputT) => optimisticUpdate({
    asyncExecutor: () => sdks.dashboard.favorites.upsert(dto),
    optimisticUpdateFn: initialMessages => pipe(
      initialMessages,
      A.filter(message => message.id !== dto.id),
      A.append(dto),
    ),
  });

  const unpin = (dto: SdkUpsertFavoriteInputT) => {
    const snapshot = store.getSnapshot();

    if (snapshot.loading) {
      return TE.left(new SdkFavoritesStillLoadingError({}));
    }

    const id = snapshot.items.find(message => message.id === dto.id)?.id;

    if (isNil(id)) {
      return TE.of(undefined);
    }

    return optimisticUpdate({
      asyncExecutor: () => sdks.dashboard.favorites.delete(dto),
      optimisticUpdateFn: initialMessages => pipe(
        initialMessages,
        A.filter(message => message.id !== id),
      ),
    });
  };

  return {
    loading,
    pin,
    unpin,
  };
}
