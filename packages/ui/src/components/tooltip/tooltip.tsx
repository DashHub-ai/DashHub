import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import clsx from 'clsx';
import { type ReactNode, useState } from 'react';

type Props = {
  children: ReactNode;
  content: ReactNode;
  className?: string;
  wrapperClassName?: string;
};

export function Tooltip({ children, content, className, wrapperClassName }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'top',
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(5),
      flip(),
      shift(),
    ],
  });

  const hover = useHover(context);
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role,
  ]);

  return (
    <>
      <span ref={refs.setReference} className={wrapperClassName} {...getReferenceProps()}>
        {children}
      </span>

      {isOpen && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            className={clsx(
              'z-50 bg-gray-900 shadow-lg px-3 py-2 rounded-md text-sm text-white',
              className,
            )}
            style={floatingStyles}
            {...getFloatingProps()}
          >
            {content}
          </div>
        </FloatingPortal>
      )}
    </>
  );
}
