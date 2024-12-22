import { type RefObject, useRef } from 'react';

import { useWindowListener } from './use-window-listener';

type OutsideClickWatcherAttrs = {
  disabled?: boolean;
  inShadowDOM?: boolean;
  excludeNodes?: () => HTMLElement[];
};

export function useOutsideClickRef<T extends HTMLElement = HTMLElement>(
  callback: (event: MouseEvent) => void,
  attrs: OutsideClickWatcherAttrs = {},
): RefObject<T | null> {
  const nodeRef = useRef<T>(null);

  useWindowListener(
    {
      click: (e) => {
        const { current: node } = nodeRef;
        const { disabled, excludeNodes } = attrs;

        if (!node || disabled) {
          return;
        }

        if (excludeNodes?.().some(node => e.target === node || node.contains(e.target as HTMLElement))) {
          return;
        }

        if (!node.contains(e.target)) {
          callback(e);
        }
      },
    },
    {
      options: {
        // must be present when component unmounts itself after clicking
        // for example checkboxes in popovers
        capture: true,
      },
    },
  );

  return nodeRef;
}
