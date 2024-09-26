import { type DependencyList, useRef } from 'react';

import { shallowCompareArrays } from '@llm/commons';

/**
 * Triggers an effect immediately if the dependencies change (during rendering of component).
 *
 * @param fn The effect function to execute.
 * @param deps The dependency list.
 */
export function useInstantEffect(fn: VoidFunction, deps: DependencyList): void {
  const prevDeps = useRef<any>(null);

  if (!shallowCompareArrays(prevDeps.current, deps)) {
    prevDeps.current = [...deps];
    fn();
  }
}
