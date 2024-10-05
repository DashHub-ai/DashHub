import type { PropsWithChildren } from 'react';

export function ModalHeader({ children }: PropsWithChildren) {
  return (
    <div className="uk-modal-header">
      {children}
    </div>
  );
}
