import { type DependencyList, useState } from 'react';

import { shallowCompareArrays } from '@llm/commons';

/**
 * Triggers an effect immediately if the dependencies change (during rendering of component).
 *
 * @param fn The effect function to execute.
 * @param deps The dependency list.
 */
export function useInstantEffect(fn: VoidFunction, deps: DependencyList): boolean {
  const [prevDeps, setDeps] = useState<any>(null);

  if (!shallowCompareArrays(prevDeps, deps)) {
    fn();
    setDeps([...deps]);
    return true;
  }

  return false;
}
