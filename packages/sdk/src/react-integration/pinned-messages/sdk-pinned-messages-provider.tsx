import { pipe } from 'fp-ts/lib/function';
import { type PropsWithChildren, useEffect, useMemo } from 'react';

import { createStoreSubscriber, tapTaskEither } from '@llm/commons';

import { useSdk } from '../hooks';
import { SdkPinnedMessagesContext, type SdkPinnedMessagesContextT, type SdkPinnedMessagesSnapshotT } from './sdk-pinned-messages-context';

export function SdkPinnedMessagesProvider({ children }: PropsWithChildren) {
  const sdk = useSdk();
  const store = useMemo<SdkPinnedMessagesContextT | null>(() => {
    if (!sdk.session.isLoggedIn) {
      return null;
    }

    const store = createStoreSubscriber<SdkPinnedMessagesSnapshotT>({
      loading: true,
    });

    const reload = pipe(
      sdk.sdks.dashboard.pinnedMessages.all(),
      tapTaskEither(
        (items) => {
          store.notify({
            loading: false,
            items,
          });
        },
        () => {
          console.error('Unable to fetch pinned messages items!');
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
    <SdkPinnedMessagesContext value={store}>
      {children}
    </SdkPinnedMessagesContext>
  );
}
