import { useSyncExternalStore } from 'react';

import { useSdkMeContextOrThrow } from '../sdk-me-context';

export function useSdkSubscribeMeOrThrow() {
  const store = useSdkMeContextOrThrow();

  return useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot,
  );
}
