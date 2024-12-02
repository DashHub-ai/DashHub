import { type DependencyList, useLayoutEffect, useRef } from 'react';

import type { Nullable } from '@llm/commons';

import { type AsyncCallbackStateHookResult, useAsyncCallback } from './use-async-callback';

/**
 * A hook that allows to execute an asynchronous function and provides the state of the execution.
 * The asynchronous function is executed immediately after the component is mounted.
 */
export function useAsyncValue<R>(
  callback: () => Promise<R>,
  deps: DependencyList,
  {
    initialValue,
  }: {
    initialValue?: Nullable<R>;
  } = {},
): AsyncValueHookResult<R> {
  const isFirstFetch = useRef(true);
  const [asyncCallback, asyncState] = useAsyncCallback(
    callback,
    initialValue
      ? {
          data: initialValue,
          status: 'success',
        }
      : {
          status: 'loading',
        },
  );

  useLayoutEffect(() => {
    // Handle sync cache support.
    if (!isFirstFetch.current || asyncState.status !== 'success') {
      void asyncCallback();
    }

    isFirstFetch.current = true;
  }, deps);

  // There might be short delay between the effect and the state update.
  // So it is possible that the status is still 'idle' after the effect.
  // In such case, we should return 'loading' status because the effect is already queued to be executed.
  if (asyncState.status === 'idle') {
    return {
      isLoading: true,
      silentReload: asyncState.silentReload,
      status: 'loading',
    };
  }

  return asyncState;
}

/**
 * The result of the `useAsyncValue` hook.
 */
export type AsyncValueHookResult<R> = Exclude<AsyncCallbackStateHookResult<never, R>, { status: 'idle'; }>;
