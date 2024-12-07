import { useLayoutEffect, useRef } from 'react';

export function useLastNonNullValue<T>(value: T | null | undefined) {
  const lastValueRef = useRef<T>();

  useLayoutEffect(() => {
    if (value !== null && value !== undefined) {
      lastValueRef.current = value;
    }
  }, [value]);

  return value ?? lastValueRef.current;
}
