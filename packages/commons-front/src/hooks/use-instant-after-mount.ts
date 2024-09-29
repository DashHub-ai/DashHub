import { useRef } from 'react';

export function useInstantAfterMount(callback: () => void | VoidFunction) {
  const executedRef = useRef<boolean>(false);

  if (!executedRef.current) {
    callback();
  }

  executedRef.current = true;
}
