import { useRef, useState } from 'react';
import { v4 } from 'uuid';

type OptimisticMigrateAttrs<A extends Array<any>, T> = {
  task: (...array: A) => Promise<T>;
  optimistic: (result: T, ...array: A) => T;
};

export function usePromiseOptimisticResponse<T>(result: T) {
  const currentMigrationId = useRef<string | null>(null);
  const [optimisticData, setOptimisticData] = useState<T>(result);

  const optimisticUpdate = <A extends Array<any>>(
    {
      optimistic,
      task,
    }: OptimisticMigrateAttrs<A, T>,
  ) => async (...args: A) => {
    const uuid = v4();

    currentMigrationId.current = uuid;
    setOptimisticData(prevOptimisticData =>
      optimistic(prevOptimisticData ?? result, ...args),
    );

    try {
      const result = await task(...args);

      if (currentMigrationId.current === uuid) {
        setOptimisticData(result);
      }

      return result;
    }
    catch (e) {
      console.error(e);
    }
  };

  return {
    result: optimisticData,
    optimisticUpdate,
  };
}
