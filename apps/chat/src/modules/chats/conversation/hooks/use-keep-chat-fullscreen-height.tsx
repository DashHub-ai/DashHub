import { useLayoutEffect, useRef } from 'react';

import { useWindowListener } from '@llm/commons-front';

export function useKeepChatFullscreenHeight<T extends HTMLElement>() {
  const elementRef = useRef<T>(null);
  const refreshHeight = () => {
    const element = elementRef.current;
    if (!element) {
      return;
    }

    const rect = element.getBoundingClientRect();
    const remainingHeight = window.innerHeight - rect.top;

    element.style.height = `${remainingHeight}px`;
  };

  useLayoutEffect(refreshHeight, []);

  useWindowListener({
    resize: refreshHeight,
    scroll: refreshHeight,
  }, { options: { passive: true } });

  return elementRef;
}
