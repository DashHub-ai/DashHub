import {
  type DependencyList,
  type EffectCallback,
  useEffect,
  useRef,
} from 'react';

export function useUpdateEffect(effect: EffectCallback, dependencies: DependencyList) {
  const isInitialMountRef = useRef(true);
  const isInitialMount = isInitialMountRef.current;

  isInitialMountRef.current = false;

  useEffect(() => {
    if (!isInitialMount) {
      effect();
    }
  }, dependencies);
}
