import type { PropsWithChildren } from 'react';

import { createPortal } from 'react-dom';

export function NavigationToolbarPortal({ children }: PropsWithChildren) {
  return createPortal(children, document.getElementById('navigation-toolbar')!);
}
