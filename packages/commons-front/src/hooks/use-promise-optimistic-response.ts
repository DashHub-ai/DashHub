import { useRef, useState } from 'react';
import { v4 } from 'uuid';

type OptimisticMigrateAttrs<A extends Array<any>, T, B> = {
  task: (before: B, ...array: A) => Promise<T>;
  before?: (attrs: { args: A; }) => B;
  optimistic: (
    attrs: {
      before: B;
      result: T;
      args: A;
    },
  ) => T;
};

export function usePromiseOptimisticResponse<T>(result: T) {
  const currentMigrationId = useRef<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [optimisticData, setOptimisticData] = useState<T>(result);

  const optimisticUpdate = <A extends Array<any>, B>(
    {
      before,
      optimistic,
      task,
    }: OptimisticMigrateAttrs<A, T, B>,
  ) => async (...args: A) => {
    const uuid = v4();
    const beforeResult = before?.({ args });

    currentMigrationId.current = uuid;

    setLoading(true);
    setOptimisticData(prevOptimisticData =>
      optimistic({
        before: beforeResult!,
        result: prevOptimisticData ?? result,
        args,
      }),
    );

    try {
      const newResult = await task(beforeResult!, ...args);

      if (currentMigrationId.current === uuid) {
        setOptimisticData(newResult);
        setLoading(false);
      }

      return newResult;
    }
    catch (e) {
      console.error(e);

      if (currentMigrationId.current === uuid) {
        setOptimisticData(result);
        setLoading(false);
      }
    }
  };

  return {
    loading,
    result: optimisticData,
    optimisticUpdate,
  };
}
