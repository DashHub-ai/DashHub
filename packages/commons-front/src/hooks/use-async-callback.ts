import { useRef, useState } from 'react';
import * as uuid from 'uuid';

import { isSSR, isTaggedError } from '@llm/commons';

import { useIsUnmountedRef } from './use-is-unmounted-ref.js';
import { useRefSafeCallback } from './use-ref-safe-callback.js';

/**
 * A hook that allows to execute an asynchronous function and provides the state of the execution.
 */
export function useAsyncCallback<A, R>(
  callback: (...args: Array<A>) => Promise<R>,
  initialAsyncState: AsyncCallbackState<R> = {
    status: 'idle',
  },
): AsyncCallbackHookResult<Array<A>, R> {
  // The state of the asynchronous callback.
  const [asyncState, setAsyncState] = useState<AsyncCallbackState<R>>(initialAsyncState);

  // A reference to the mounted state of the component.
  const unmountedRef = useIsUnmountedRef();

  // A reference to the previous execution UUID. It is used to prevent race conditions between multiple executions
  // of the asynchronous function. If the UUID of the current execution is different than the UUID of the previous
  // execution, the state is not updated.
  const prevExecutionUIDRef = useRef<string | null>(null);

  // The asynchronous executor function, which is a wrapped version of the original callback.
  const asyncExecutor = useRefSafeCallback(async (...args: Array<A>) => {
    if (unmountedRef.current || isSSR()) {
      return null;
    }

    const currentExecutionUUID = uuid.v4();
    prevExecutionUIDRef.current = currentExecutionUUID;

    try {
      // Prevent unnecessary state updates, keep loading state if the status is already 'loading'.
      if (asyncState.status !== 'loading') {
        setAsyncState({
          status: 'loading',
        });
      }

      // Execute the asynchronous function.
      const result = await callback(...args);

      // Update the state if the component is still mounted and the execution UUID matches the previous one, otherwise
      // ignore the result and keep the previous state.
      if (!unmountedRef.current && prevExecutionUIDRef.current === currentExecutionUUID) {
        setAsyncState({
          status: 'success',
          data: result,
        });
      }

      return result;
    }
    catch (error: any) {
      if (isTaggedError(error)) {
        console.error(error.tag, error.context);
      }
      else {
        console.error(error);
      }

      // Update the state if the component is still mounted and the execution UUID matches the previous one, otherwise
      if (!unmountedRef.current && prevExecutionUIDRef.current === currentExecutionUUID) {
        setAsyncState({
          status: 'error',
          error,
        });
      }
    }

    return null;
  });

  // A function that forces the reload of the asynchronous function.
  const silentReload = useRefSafeCallback(async (...args: Array<A>): Promise<R | null> => {
    if (unmountedRef.current) {
      return null;
    }

    const currentExecutionUUID = uuid.v4();

    prevExecutionUIDRef.current = currentExecutionUUID;

    const result = await callback(...args);

    if (!unmountedRef.current && prevExecutionUIDRef.current === currentExecutionUUID) {
      setAsyncState({
        status: 'success',
        data: result,
      });
    }

    return result;
  });

  return [
    asyncExecutor,
    {
      ...asyncState,
      silentReload,
      isLoading: asyncState.status === 'loading',
    },
  ] as AsyncCallbackHookResult<Array<A>, R>;
}

/**
 * Represents the result of the `useAsyncCallback` hook.
 */
export type AsyncCallbackHookResult<A extends Array<unknown>, R> = [
  (...args: A) => Promise<R | null>,
  AsyncCallbackStateHookResult<R>,
];

/**
 * Represents the result of the `useAsyncCallback` hook.
 */
export type AsyncCallbackStateHookResult<R> = AsyncCallbackState<R> & {
  isLoading: boolean;
  silentReload: () => Promise<R | null>;
};

/**
 * Represents the state of an asynchronous callback.
 */
export type AsyncCallbackState<T> =
  | {
    status: 'idle';
  }
  | {
    status: 'loading';
  }
  | {
    status: 'success';
    data: T;
  }
  | {
    status: 'error';
    error: any;
  };
