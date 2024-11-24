import { type DependencyList, useEffect, useState } from 'react';

import { useIsMountedRef } from './use-is-mounted-ref';

type Attrs<R> = {
  fetcher: () => Promise<R>;
  setter: (result: R) => void;
  deps?: DependencyList;
};

export function useAsyncSetter<R>(
  {
    fetcher,
    setter,
    deps = [],
  }: Attrs<R>,
) {
  const [setting, setSetting] = useState(true);
  const isMountedRef = useIsMountedRef();

  useEffect(() => {
    fetcher()
      .then((result) => {
        if (isMountedRef.current) {
          setter(result);
        }
      })
      .catch(console.error)
      .finally(() => {
        setSetting(false);
      });
  }, deps);

  return {
    setting,
  };
}
