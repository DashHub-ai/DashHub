import type { CanBePromise } from '../types';

export type AsyncDebounceConfig = {
  delay: number;
  initialInstant?: boolean;
};

export type AsyncCallback<A extends unknown[], R> = (
  ...args: A
) => CanBePromise<R>;

export type AsyncDebouncedCallback<A extends unknown[], R> = (
  ...args: A
) => Promise<R>;

export function asyncDebounce<A extends unknown[], R>(config: AsyncDebounceConfig, fn: AsyncCallback<A, R>): AsyncDebouncedCallback<A, R> {
  const { delay, initialInstant = false } = config;
  const lastCallUUID: { current: number | null; } = { current: null };

  let timer: NodeJS.Timeout | null = null;
  let firstCall = false;

  return async (...args: A): Promise<R> => {
    const uuid = Date.now();
    lastCallUUID.current = uuid;

    return new Promise((resolve, reject) => {
      const safeCall = async () => {
        try {
          const result = await fn(...args);

          if (lastCallUUID.current === uuid) {
            lastCallUUID.current = null;
            resolve(result);
          }
        }
        catch (e) {
          reject(e);
        }
      };

      if (!firstCall) {
        firstCall = true;
        if (initialInstant) {
          void safeCall();
          return;
        }
      }

      if (timer !== null) {
        clearTimeout(timer);
      }

      timer = setTimeout(() => {
        void safeCall();
      }, delay);
    });
  };
}
