import type { CanBePromise } from '../types';

/**
 * Waits for a condition to be met.
 *
 * @param callback The callback to execute.
 * @param config Configuration for the function.
 * @param config.timeOutAfter The time in milliseconds after which the function will stop retrying and reject the promise.
 * @param config.retryAfter The time in milliseconds between retries.
 * @returns A promise that resolves when the condition is met.
 */
export function waitFor<R>(
  callback: () => CanBePromise<R>,
  {
    timeOutAfter = 500,
    retryAfter = 100,
  }: WaitForConfig = {},
): Promise<R> {
  // Retry the callback until it succeeds or the timeout is reached.
  return new Promise<R>((resolve, reject) => {
    const startTime = Date.now();
    let lastError: Error | null = null;

    const timeoutTimerId = setTimeout(
      () => {
        reject(lastError ?? new Error('Timeout'));
      },
      timeOutAfter,
    );

    const tick = async () => {
      try {
        const result = await callback();
        clearTimeout(timeoutTimerId);
        resolve(result);
      }
      catch (err: any) {
        lastError = err;

        if (Date.now() - startTime > timeOutAfter) {
          reject(err);
        }
        else {
          setTimeout(tick, retryAfter);
        }
      }
    };

    tick();
  });
}

/**
 * Configuration for the `waitFor` function.
 */
export type WaitForConfig = {
  // The time in milliseconds after which the function will stop retrying and reject the promise.
  timeOutAfter?: number;

  // The time in milliseconds between retries.
  retryAfter?: number;
};
