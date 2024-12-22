import type { RefObject } from 'react';

type CallbackRef<T> = (element: T) => void;

type ReactRef<T> = CallbackRef<T | null> | RefObject<T | null> | null;

export function mergeRefs<T>(...refs: Array<ReactRef<T>>): CallbackRef<T> {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(value);
      }
      else if (ref != null) {
        ref.current = value;
      }
    });
  };
}
