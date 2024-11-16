import { useRef } from 'react';

import { useAfterMount } from './use-after-mount';

export function useFocusAfterMount<E extends HTMLElement>() {
  const ref = useRef<E>(null);

  useAfterMount(() => {
    ref.current?.focus();
  });

  return ref;
}
