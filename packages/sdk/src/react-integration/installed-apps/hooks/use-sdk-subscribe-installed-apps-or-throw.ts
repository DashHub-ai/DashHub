import { useSyncExternalStore } from 'react';

import { useSdkInstalledAppsContextOrThrow } from '../sdk-installed-apps-context';

export function useSdkSubscribeInstalledAppsOrThrow() {
  const store = useSdkInstalledAppsContextOrThrow();

  return useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot,
  );
}
