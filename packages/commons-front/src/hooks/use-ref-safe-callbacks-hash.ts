import { mapWithIndex } from 'fp-ts/lib/Record';
import { useMemo, useRef } from 'react';

export type CallbacksHash<F extends Function = Function> = Record<string, F>;

/**
 * Function that returns hash that has the same reference.
 *
 * @see
 *  - Reference changes only if object keys change.
 *  - Function passed to callback hash does not need any kind of dependency keys.
 *    Hash always calls the newest JS function stored in callbacksRef
 *
 * @example
 *  const handlers = useRefSafeCallbacksHash({
 *    click: () => { ... }
 *  });
 *
 *  useEffect(() => { ... }, [handlers]);
 */
export function useRefSafeCallbacksHash<F extends Function>(hash: CallbacksHash<F>): CallbacksHash<F> {
  const cacheKey = Object.keys(hash).join(',');
  const callbacksRef = useRef<CallbacksHash | null>(null);
  callbacksRef.current = hash;

  return useMemo(() => {
    const result = mapWithIndex(
      (key: string) =>
        (...args: any[]) =>
          (callbacksRef.current?.[key] as any)?.apply(window, args),
    )(hash ?? {});

    return result as unknown as CallbacksHash<F>;
  }, [cacheKey]);
}
