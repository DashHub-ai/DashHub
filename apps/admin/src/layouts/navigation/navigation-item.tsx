import type { PropsWithChildren, ReactNode } from 'react';

import clsx from 'clsx';
import { Link, useLocation } from 'wouter';

type Props = PropsWithChildren & {
  as?: any;
  path?: string;
  icon: ReactNode;
  disabled?: boolean;
  active?: boolean;
  className?: string;
};

export function NavigationItem({ as: Tag = 'li', path, icon, children, disabled, active, className }: Props) {
  const [location] = useLocation();

  active ??= path ? location === path : false;

  const content = (
    <span
      className={clsx(
        'flex items-center gap-2 px-3 py-2 rounded-md transition-colors',
        'hover:bg-gray-100 cursor-default',
        active && 'bg-gray-100 text-primary',
        disabled && 'text-gray-400',
        className,
      )}
    >
      <span className="size-4">
        {icon}
      </span>
      <span>{children}</span>
    </span>
  );

  if (!path) {
    return <Tag>{content}</Tag>;
  }

  return (
    <Tag>
      <Link
        href={path}
        aria-disabled={disabled}
        className={clsx(disabled && 'pointer-events-none')}
      >
        {content}
      </Link>
    </Tag>
  );
}
