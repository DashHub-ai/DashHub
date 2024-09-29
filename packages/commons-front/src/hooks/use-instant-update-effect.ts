import type { DependencyList } from 'react';

import { useState } from 'react';

import { shallowCompareArrays } from '@llm/commons';

export function useInstantUpdateEffect(fn: VoidFunction, deps: DependencyList) {
  const [prevDeps, setPrevDeps] = useState(deps);

  if (prevDeps && !shallowCompareArrays(prevDeps, deps)) {
    setPrevDeps(deps);
    fn();
  }
}
