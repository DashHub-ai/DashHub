import { useRef } from 'react';

import {
  type HookElementListenersAttrs,
  type ListenersHash,
  useElementListener,
} from './use-element-listener';

export function useElementListenerRef<E extends HTMLElement>(
  hash: ListenersHash,
  attrs: Omit<HookElementListenersAttrs, 'selectorFn'> = {},
) {
  const ref = useRef<E | null>(null);

  useElementListener(hash, {
    ...attrs,
    selectorFn: () => ref.current,
  });

  return ref;
}
