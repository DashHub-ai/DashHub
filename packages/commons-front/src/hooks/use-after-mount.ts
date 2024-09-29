import { useEffect } from 'react';

export function useAfterMount(callback: () => void | VoidFunction) {
  useEffect(callback, []);
}
