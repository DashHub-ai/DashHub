import { type MutableRefObject, useEffect, useRef } from 'react';

/**
 * Custom hook that returns a mutable ref object indicating whether the component is unmounted or not.
 *
 * @returns The mutable ref object.
 */
export function useIsUnmountedRef(): MutableRefObject<boolean> {
  const mountedRef = useRef<boolean>(false);

  useEffect(() => {
    // Prevent issues in strict mode.
    mountedRef.current = false;

    return () => {
      mountedRef.current = true;
    };
  }, []);

  return mountedRef;
}
