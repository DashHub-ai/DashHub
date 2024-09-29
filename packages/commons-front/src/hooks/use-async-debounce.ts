import { useRef } from 'react';

import {
  type AsyncCallback,
  asyncDebounce,
  type AsyncDebounceConfig,
  type AsyncDebouncedCallback,
} from '@llm/commons';

import { useRefSafeCallback } from './use-ref-safe-callback';

export function useAsyncDebounce<A extends unknown[], R>(
  fn: AsyncCallback<A, R>,
  config: AsyncDebounceConfig & { disabled?: boolean; },
) {
  const safeCallback = useRefSafeCallback(fn);
  const debounceRef = useRef<AsyncDebouncedCallback<A, R>>();

  if (!!config.disabled || !config.delay) {
    return async (...args: A) => Promise.resolve(safeCallback(...args));
  }

  if (!debounceRef.current) {
    debounceRef.current = asyncDebounce(config, async (...args) =>
      safeCallback(...args));
  }

  return debounceRef.current;
}
