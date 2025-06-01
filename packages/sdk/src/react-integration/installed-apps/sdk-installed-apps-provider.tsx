import { pipe } from 'fp-ts/lib/function';
import { type PropsWithChildren, useEffect, useMemo } from 'react';

import type { SdkTableRowIdT } from '~/shared';

import { createStoreSubscriber, type Nullable, tapTaskEither } from '@dashhub/commons';

import { useSdk } from '../hooks';
import {
  SdkInstalledAppsContext,
  type SdkInstalledAppsContextT,
  type SdkInstalledAppsSnapshotT,
} from './sdk-installed-apps-context';

type Props = PropsWithChildren & {
  organizationId: Nullable<SdkTableRowIdT>;
};

export function SdkInstalledAppsProvider({ children, organizationId }: Props) {
  const sdk = useSdk();

  const store = useMemo<SdkInstalledAppsContextT | null>(() => {
    if (!sdk.session.isLoggedIn || !organizationId) {
      return null;
    }

    const store = createStoreSubscriber<SdkInstalledAppsSnapshotT>({
      loading: true,
    });

    const reload = pipe(
      sdk.sdks.dashboard.apps.commercial.allInstalled({ organizationIds: [organizationId] }),
      tapTaskEither(
        (items) => {
          store.notify({
            loading: false,
            items,
          });
        },
        () => {
          console.error('Unable to fetch installed apps!');
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
    <SdkInstalledAppsContext value={store}>
      {children}
    </SdkInstalledAppsContext>
  );
}
