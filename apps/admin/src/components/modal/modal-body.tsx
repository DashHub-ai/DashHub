import type { PropsWithChildren } from 'react';

export function ModalBody({ children }: PropsWithChildren) {
  return (
    <div className="uk-modal-body">
      {children}
    </div>
  );
}
