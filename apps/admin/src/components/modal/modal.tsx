import type { PropsWithChildren, ReactNode } from 'react';

import { clsx } from 'clsx';

import { useIsMounted } from '@llm/commons-front';

import { ModalBody } from './modal-body';
import { ModalCloseButton } from './modal-close-button';
import { ModalFooter } from './modal-footer';
import { ModalHeader } from './modal-header';

export type ModalProps = PropsWithChildren & {
  className?: string;
  header?: ReactNode;
  footer?: ReactNode;
  isLeaving?: boolean;
  formProps?: JSX.IntrinsicElements['form'];
  onClose: VoidFunction;
};

export function Modal(
  {
    children,
    header,
    footer,
    className,
    isLeaving,
    formProps,
    onClose,
  }: ModalProps,
) {
  const isMounted = useIsMounted();
  const DialogTag = formProps ? 'form' : 'div';

  return (
    <div
      className={clsx(
        'uk-flex-top uk-modal uk-flex',
        {
          'uk-open': isMounted && !isLeaving,
          'uk-display-block': isMounted,
        },
        className,
      )}
    >
      <DialogTag
        role="dialog"
        aria-modal="true"
        {...formProps as any}
        className={clsx('uk-modal-dialog', formProps?.className)}
      >
        <ModalCloseButton onClick={onClose} />

        {header && (
          <ModalHeader>
            {header}
          </ModalHeader>
        )}

        <ModalBody>
          {children}
        </ModalBody>

        {footer && (
          <ModalFooter>
            {footer}
          </ModalFooter>
        )}
      </DialogTag>
    </div>
  );
}
