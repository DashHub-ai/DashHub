import type { PropsWithChildren } from 'react';

export function ModalFooter({ children }: PropsWithChildren) {
  return (
    <div className="uk-modal-footer flex space-x-2 justify-end">
      {children}
    </div>
  );
}
