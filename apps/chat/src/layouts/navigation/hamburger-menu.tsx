import clsx from 'clsx';
import { MenuIcon, X } from 'lucide-react';

import { useModal } from '@dashhub/commons-front';

import { NavigationLinks } from './links';

type Props = {
  className?: string;
};

export function HamburgerMenu({ className }: Props) {
  const menuModal = useModal({
    renderModalContent: ({ onClose }) => (
      <div className={clsx(
        'z-50 fixed inset-0 bg-background/95',
        'flex flex-col items-center pt-20',
      )}
      >
        <button
          className={clsx(
            'top-4 right-4 absolute',
            'h-10 w-10 inline-flex items-center justify-center',
            'text-sm font-medium rounded-md',
            'bg-transparent hover:bg-muted transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring',
          )}
          onClick={() => void onClose()}
          type="button"
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
        <div className={clsx('w-full max-w-md')}>
          <NavigationLinks inMobileMenu />
        </div>
      </div>
    ),
  });

  return (
    <button
      className={clsx(
        className,
        'h-10 w-10 inline-flex items-center justify-center',
        'text-sm font-medium rounded-md',
        'bg-transparent hover:bg-muted transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring',
      )}
      onClick={() => menuModal.show()}
      type="button"
      aria-label="Open menu"
    >
      <MenuIcon size={24} />
    </button>
  );
}
