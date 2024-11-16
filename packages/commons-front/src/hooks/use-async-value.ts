import type { DependencyList } from 'react';

import { type AsyncCallbackState, useAsyncCallback } from './use-async-callback';
import { useInstantEffect } from './use-instant-effect';

/**
 * A hook that allows to execute an asynchronous function and provides the state of the execution.
 * The asynchronous function is executed immediately after the component is mounted.
 */
export function useAsyncValue<R>(
  callback: () => Promise<R>,
  deps: DependencyList,
): AsyncValueHookResult<R> {
  const [asyncCallback, asyncState] = useAsyncCallback(callback);

  const executed = useInstantEffect(asyncCallback, deps);

  // There might be short delay between the effect and the state update.
  // So it is possible that the status is still 'idle' after the effect.
  // In such case, we should return 'loading' status because the effect is already queued to be executed.
  if (executed || asyncState.status === 'idle') {
    return {
      status: 'loading',
    };
  }

  return asyncState;
}

/**
 * The result of the `useAsyncValue` hook.
 */
export type AsyncValueHookResult<R> = Exclude<AsyncCallbackState<R>, { status: 'idle'; }>;
