import { type MutableRefObject, useEffect, useRef } from 'react';

/**
 * Custom hook that returns a mutable ref object indicating whether the component is mounted or not.
 *
 * @returns The mutable ref object.
 */
export function useIsMountedRef(): MutableRefObject<boolean> {
  const mountedRef = useRef<boolean>(false);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  return mountedRef;
}
