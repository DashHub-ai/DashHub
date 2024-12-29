import type { PropsWithChildren, ReactNode } from 'react';

import { clsx } from 'clsx';
import { Link, useRoute } from 'wouter';

type SideNavItemProps = PropsWithChildren & {
  icon: ReactNode;
  isActive?: boolean;
  href?: string;
  onClick?: () => void;
};

export function SideNavItem({ icon, isActive: isActiveProp, onClick, href, children }: SideNavItemProps) {
  const [isCurrentRoute] = useRoute(href ?? '');
  const isActive = isActiveProp ?? (href ? isCurrentRoute : false);

  const className = clsx(
    'flex items-center gap-3 px-3 py-2 rounded-md w-full text-sm transition-colors',
    isActive
      ? 'bg-primary/5 text-primary font-semibold'
      : 'text-muted-foreground hover:bg-gray-100',
  );

  if (href) {
    return (
      <Link href={href} className={className} replace>
        {icon}
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={className}
    >
      {icon}
      {children}
    </button>
  );
}
