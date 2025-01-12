import type { ReactNode } from 'react';

import clsx from 'clsx';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xs';

const sizeClasses: Record<AvatarSize, string> = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
};

type Props = {
  size?: AvatarSize;
  name: string;
  src?: string | null;
  fallback?: ReactNode;
  className?: string;
};

export function Avatar({ size = 'md', name, src, fallback, className }: Props) {
  const initials = name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={clsx(
        'relative flex justify-center items-center bg-gray-100 rounded-full text-gray-600',
        sizeClasses[size],
        className,
      )}
    >
      {src
        ? (
            <img
              src={src}
              alt={name}
              className="rounded-full w-full h-full object-cover"
            />
          )
        : fallback
          ? (
              <div className="text-gray-400">{fallback}</div>
            )
          : (
              <span className="font-medium text-sm">{initials}</span>
            )}
    </div>
  );
}
