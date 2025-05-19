import { useEffect } from 'react';

import type { StoreSubscriber } from '@dashhub/commons';

import { useRefSafeCallback } from '../use-ref-safe-callback';

export function useNonRerenderSubscribeStore<V>(store: StoreSubscriber<V> | null, subscriber: (value: V) => void) {
  const safeSubscriber = useRefSafeCallback(subscriber);

  useEffect(() => {
    if (!store) {
      return;
    }

    safeSubscriber(store.getSnapshot());

    store.subscribe(safeSubscriber);
  }, [store]);
}
