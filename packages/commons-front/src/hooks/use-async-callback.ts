import { useRef, useState } from 'react';
import { v4 as uid } from 'uuid';

import { isSSR } from '@llm/commons';

import { useIsUnmountedRef } from './use-is-unmounted-ref.js';
import { useRefSafeCallback } from './use-ref-safe-callback.js';

/**
 * A hook that allows to execute an asynchronous function and provides the state of the execution.
 */
export function useAsyncCallback<A extends Array<unknown>, R>(callback: (...args: Array<A>) => Promise<R>): AsyncCallbackHookResult<A, R> {
  // The state of the asynchronous callback.
  const [asyncState, setAsyncState] = useState<AsyncCallbackState<R>>({
    status: 'idle',
  });

  // A reference to the mounted state of the component.
  const unmountedRef = useIsUnmountedRef();

  // A reference to the previous execution UUID. It is used to prevent race conditions between multiple executions
  // of the asynchronous function. If the UUID of the current execution is different than the UUID of the previous
  // execution, the state is not updated.
  const prevExecutionUIDRef = useRef<string | null>(null);

  // The asynchronous executor function, which is a wrapped version of the original callback.
  const asyncExecutor = useRefSafeCallback(async (...args: Array<any>) => {
    if (unmountedRef.current || isSSR()) {
      return null;
    }

    const currentExecutionUUID = uid();
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
      console.error(error);

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

  return [asyncExecutor, asyncState] as AsyncCallbackHookResult<A, R>;
}

/**
 * Represents the result of the `useAsyncCallback` hook.
 */
export type AsyncCallbackHookResult<A extends Array<unknown>, R> = [
  (...args: Array<A>) => Promise<R | null>,
  AsyncCallbackState<R>,
];

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
