import {
  type HookElementListenersAttrs,
  type ListenersHash,
  useElementListener,
} from './use-element-listener';

/**
 * Mounts listeners to window, functions are cache safe.
 *
 * @example
 *  useWindowListener({
 *    resize() { ... },
 *  });
 */
export function useWindowListener(
  hash: ListenersHash,
  attrs?: Omit<HookElementListenersAttrs, 'selectorFn'>,
) {
  useElementListener(hash, {
    ...attrs,
    selectorFn: () => window,
  });
}
