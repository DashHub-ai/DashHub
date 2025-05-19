import clsx from 'clsx';
import { useMemo } from 'react';

import type { SdkTableRowIdT } from '@dashhub/sdk';

export const AVATAR_SIZE_CLASSES = {
  xs: 'h-6 w-6 text-xs',
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-base',
  lg: 'h-12 w-12 text-lg',
} as const;

const COLORS = [
  'bg-red-100 text-red-800 border-2 border-red-200',
  'bg-blue-100 text-blue-800 border-2 border-blue-200',
  'bg-green-100 text-green-800 border-2 border-green-200',
  'bg-yellow-100 text-yellow-800 border-2 border-yellow-200',
  'bg-purple-100 text-purple-800 border-2 border-purple-200',
  'bg-pink-100 text-pink-800 border-2 border-pink-200',
  'bg-indigo-100 text-indigo-800 border-2 border-indigo-200',
];

let COLOR_COUNTER = 0;
const COLOR_CACHE = new Map<string, string>();

export type ColorizedAvatarSize = keyof typeof AVATAR_SIZE_CLASSES;

type Props = {
  className?: string;
  id: SdkTableRowIdT;
  name: string;
  size?: ColorizedAvatarSize;
};

export function ColorizedAvatar({ id, className, name, size = 'md' }: Props) {
  const firstLetter = name.charAt(0).toUpperCase();
  const colorClass = useMemo(() => {
    const cacheKey = `${name}#${id}`;

    if (!COLOR_CACHE.has(cacheKey)) {
      const colorIndex = COLOR_COUNTER % COLORS.length;

      COLOR_CACHE.set(cacheKey, COLORS[colorIndex]);
      COLOR_COUNTER++;
    }

    return COLOR_CACHE.get(cacheKey)!;
  }, [id, name]);

  return (
    <span
      className={clsx(
        'inline-flex relative justify-center items-center rounded-full font-semibold select-none',
        AVATAR_SIZE_CLASSES[size],
        colorClass,
        className,
      )}
    >
      <span className="absolute flex justify-center items-center w-full h-full">
        {firstLetter}
      </span>
    </span>
  );
}
