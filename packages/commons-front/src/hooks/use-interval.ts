import { useEffect } from 'react';

import { useRefSafeCallback } from './use-ref-safe-callback';

export function useInterval(fn: VoidFunction, delay: number | null) {
  const safeCallback = useRefSafeCallback(fn);

  useEffect(() => {
    if (delay === null) {
      return;
    }

    const id = setInterval(safeCallback, delay);

    return () => {
      clearInterval(id);
    };
  }, [delay]);
}
