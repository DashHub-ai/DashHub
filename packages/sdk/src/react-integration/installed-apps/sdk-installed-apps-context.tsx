import { createContext } from 'react';

import type { StoreSubscriber } from '@dashhub/commons';
import type { AppsSdk, SdkInstalledAppMetadataT } from '~/modules';

import { useContextOrThrow } from '@dashhub/commons-front';

export type SdkInstalledAppsSnapshotT =
  | { loading: true; }
  | { loading: false; items: SdkInstalledAppMetadataT[]; };

export type SdkInstalledAppsContextT =
  & StoreSubscriber<SdkInstalledAppsSnapshotT>
  & {
    reload: ReturnType<AppsSdk['commercial']['allInstalled']>;
  };

export const SdkInstalledAppsContext = createContext<SdkInstalledAppsContextT | null>(null);

export const useSdkInstalledAppsContextOrThrow = () => useContextOrThrow(SdkInstalledAppsContext, 'Missing SDK InstalledApps context in tree!');
