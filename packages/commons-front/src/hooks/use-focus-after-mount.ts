import { useRef } from 'react';

import { useAfterMount } from './use-after-mount';

export function useFocusAfterMount<E extends HTMLElement>(enabled?: boolean) {
  const ref = useRef<E>(null);

  useAfterMount(() => {
    if (enabled !== false) {
      ref.current?.focus();
    }
  });

  return ref;
}
