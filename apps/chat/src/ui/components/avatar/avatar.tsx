import type { ReactNode } from 'react';

import clsx from 'clsx';

import { AVATAR_SIZE_CLASSES } from './colorized-avatar';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xs';

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
    <span
      className={clsx(
        'inline-flex relative justify-center items-center bg-gray-100 rounded-full text-gray-600',
        'border-2 border-gray-200',
        AVATAR_SIZE_CLASSES[size],
        className,
      )}
    >
      {src
        ? (
            <img
              src={src}
              alt={name}
              className="rounded-full w-full h-full object-contain"
            />
          )
        : fallback
          ? (
              <span className="text-gray-400">{fallback}</span>
            )
          : (
              <span className="font-medium text-sm">{initials}</span>
            )}
    </span>
  );
}
