import { useCallback, useRef } from 'react';

/**
 * Hook that guarantees that returns constant reference for passed function.
 * Useful for preventing closures from capturing cached scope variables (avoiding the stale closure problem).
 */
export function useRefSafeCallback<A extends Array<unknown>, R>(fn: (...args: A) => R): typeof fn {
  const callbackRef = useRef<typeof fn>(null);
  callbackRef.current = fn;

  return useCallback(
    (...args: A): R => (callbackRef.current as typeof fn)(...args),
    [],
  );
}
