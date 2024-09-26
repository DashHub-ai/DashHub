import { type MutableRefObject, useRef } from 'react';

import { useWindowListener } from './use-window-listener';

type OutsideClickWatcherAttrs = {
  disabled?: boolean;
  inShadowDOM?: boolean;
};

export function useOutsideClickRef<T extends HTMLElement = HTMLElement>(
  callback: (event: MouseEvent) => void,
  attrs: OutsideClickWatcherAttrs = {},
): MutableRefObject<T | null> {
  const nodeRef = useRef<T>(null);

  useWindowListener(
    {
      click: (e) => {
        const { current: node } = nodeRef;

        if (!node || attrs.disabled) {
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
