import type { PropsWithChildren } from 'react';

export function ModalTitle({ children }: PropsWithChildren) {
  return (
    <h2 className="uk-modal-title">
      {children}
    </h2>
  );
}
