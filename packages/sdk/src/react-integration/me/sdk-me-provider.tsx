import { pipe } from 'fp-ts/lib/function';
import { type PropsWithChildren, useEffect, useMemo } from 'react';

import { createStoreSubscriber, tapTaskEither } from '@dashhub/commons';

import { useSdk } from '../hooks';
import { SdkMeContext, type SdkMeContextT, type SdkMeSnapshotT } from './sdk-me-context';

export function SdkMeProvider({ children }: PropsWithChildren) {
  const sdk = useSdk();
  const store = useMemo<SdkMeContextT | null>(() => {
    if (!sdk.session.isLoggedIn) {
      return null;
    }

    const store = createStoreSubscriber<SdkMeSnapshotT>({
      loading: true,
    });

    const reload = pipe(
      sdk.sdks.dashboard.users.me.get(),
      tapTaskEither(
        (me) => {
          store.notify({
            loading: false,
            me,
          });
        },
        () => {
          console.error('Unable to fetch user profile!');
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
    <SdkMeContext value={store}>
      {children}
    </SdkMeContext>
  );
}
