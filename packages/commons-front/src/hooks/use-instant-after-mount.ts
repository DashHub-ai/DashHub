import { useInstantEffect } from './use-instant-effect';

export function useInstantAfterMount(callback: () => void | VoidFunction) {
  useInstantEffect(callback, []);
}
