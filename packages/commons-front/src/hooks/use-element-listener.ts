import { useEffect } from 'react';

import type { Nullable } from '@llm/commons';

import { useRefSafeCallback } from './use-ref-safe-callback';
import {
  type CallbacksHash,
  useRefSafeCallbacksHash,
} from './use-ref-safe-callbacks-hash';

export type AbstractEventListener<E extends Event = any> = (event: E) => void;

export type ListenersHash = CallbacksHash<AbstractEventListener>;

export type HookElementListenersAttrs = {
  selectorFn: () => Nullable<EventTarget>;
  remountKey?: string;
  options?: AddEventListenerOptions;
};

export function useElementListener(
  hash: ListenersHash,
  {
    selectorFn,
    remountKey,
    options = {},
  }: HookElementListenersAttrs,
) {
  const listeners = useRefSafeCallbacksHash(hash);
  const safeElementSelector = useRefSafeCallback(selectorFn);

  useEffect(() => {
    const element = safeElementSelector();

    if (!element) {
      return undefined;
    }

    const cachedListeners = Object.entries<AbstractEventListener>(listeners);

    cachedListeners.forEach(([event, listener]) => {
      element.addEventListener(event, listener, options);
    });

    return () => {
      cachedListeners.forEach(([event, listener]) => {
        element.removeEventListener(event, listener, options);
      });
    };
  }, [listeners, remountKey]);
}
