import { clsx } from 'clsx';
import { type ComponentProps, type PropsWithChildren, type ReactNode, useState } from 'react';

import { useTimeout } from '@dashhub/commons-front';

import { ModalBody } from './modal-body';
import { ModalCloseButton } from './modal-close-button';
import { ModalFooter, type ModalFooterProps } from './modal-footer';
import { ModalHeader } from './modal-header';

export type ModalProps = PropsWithChildren & {
  className?: string;
  header?: ReactNode;
  footer?: ReactNode;
  isLeaving?: boolean;
  isOverflowVisible?: boolean;
  formProps?: ComponentProps<'form'>;
  footerProps?: ModalFooterProps;
  onClose: VoidFunction;
};

export function Modal(
  {
    children,
    header,
    footer,
    className,
    isLeaving,
    isOverflowVisible,
    formProps,
    footerProps,
    onClose,
  }: ModalProps,
) {
  const [isOpened, setOpened] = useState(false);
  const DialogTag = formProps?.onSubmit ? 'form' : 'div';

  useTimeout(() => {
    setOpened(true);
  }, { time: 80 });

  return (
    <div
      className={clsx(
        'uk-flex uk-flex-top uk-modal',
        {
          'uk-open': isOpened && !isLeaving,
          'uk-display-block': isOpened,
        },
        className,
      )}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <DialogTag
        role="dialog"
        aria-modal="true"
        {...formProps as any}
        className={clsx(
          'uk-modal-dialog',
          isOverflowVisible && 'overflow-visible',
          formProps?.className,
        )}
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
          <ModalFooter {...footerProps}>
            {footer}
          </ModalFooter>
        )}
      </DialogTag>
    </div>
  );
}
