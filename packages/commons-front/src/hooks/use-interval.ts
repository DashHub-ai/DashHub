import { useEffect } from 'react';

import { useRefSafeCallback } from './use-ref-safe-callback';

type Attrs = {
  maxTicks?: number;
};

export function useInterval(fn: VoidFunction, delay: number | null, { maxTicks }: Attrs = {}) {
  const safeCallback = useRefSafeCallback(fn);

  useEffect(() => {
    if (delay === null) {
      return;
    }

    let ticks = 0;
    const id = setInterval(() => {
      if (maxTicks && ticks++ >= maxTicks) {
        clearInterval(id);
        return;
      }

      safeCallback();
    }, delay);

    return () => {
      clearInterval(id);
    };
  }, [delay]);
}
