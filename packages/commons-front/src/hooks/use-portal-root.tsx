import { useEffect, useRef } from 'react';

import { useForceRerender } from './use-force-rerender';

export function usePortalRoot(id: string) {
  const portalRef = useRef<HTMLElement | null>(null);
  const { forceRerender } = useForceRerender();

  useEffect(() => {
    let element = document.getElementById(id);

    if (!element) {
      element = document.createElement('div');
      element.id = id;
      document.body.appendChild(element);
    }

    portalRef.current = element;
    forceRerender();

    return () => {
      if (element && !element.childNodes.length) {
        element.remove();
      }
    };
  }, [id]);

  return portalRef;
}
