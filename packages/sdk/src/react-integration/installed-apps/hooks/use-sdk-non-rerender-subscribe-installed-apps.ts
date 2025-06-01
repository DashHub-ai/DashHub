import { useNonRerenderSubscribeStore } from '@dashhub/commons-front';

import {
  type SdkInstalledAppsSnapshotT,
  useSdkInstalledAppsContextOrThrow,
} from '../sdk-installed-apps-context';

export function useSdkNonRerenderSubscribeInstalledApps(subscriber: (InstalledApps: SdkInstalledAppsSnapshotT) => void) {
  const store = useSdkInstalledAppsContextOrThrow();

  return useNonRerenderSubscribeStore(store, subscriber);
}
