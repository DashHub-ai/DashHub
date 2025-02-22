import { useSyncExternalStore } from 'react';

import { useSdkPinnedMessagesContextOrThrow } from '../sdk-pinned-messages-context';

export function useSdkSubscribePinnedMessagesOrThrow() {
  const store = useSdkPinnedMessagesContextOrThrow();

  return useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot,
  );
}
