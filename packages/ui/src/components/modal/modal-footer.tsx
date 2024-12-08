import type { PropsWithChildren } from 'react';

import clsx from 'clsx';

export type ModalFooterProps = PropsWithChildren & {
  absolute?: boolean;
};

export function ModalFooter({ children, absolute }: ModalFooterProps) {
  return (
    <div
      className={clsx(
        'flex justify-end space-x-2 uk-modal-footer',
        absolute && 'absolute bottom-0 right-0 w-full',
      )}
    >
      {children}
    </div>
  );
}
