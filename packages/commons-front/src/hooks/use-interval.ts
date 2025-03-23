import { useEffect } from 'react';

import { useRefSafeCallback } from './use-ref-safe-callback';

type Attrs = {
  maxTicks?: number;
  disable?: boolean;
};

export function useInterval(fn: VoidFunction, delay: number | null, { maxTicks, disable }: Attrs = {}) {
  const safeCallback = useRefSafeCallback(fn);

  useEffect(() => {
    if (delay === null || disable) {
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
  }, [delay, disable]);
}
