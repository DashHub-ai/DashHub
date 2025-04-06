import type { HTMLAttributes } from 'react';

import clsx from 'clsx';

import { Skeleton } from '../skeleton';

type CardSkeletonProps = HTMLAttributes<HTMLDivElement> & {
  withFooter?: boolean;
  className?: string;
};

export function CardSkeleton(
  {
    withFooter = true,
    className,
    ...props
  }: CardSkeletonProps,
) {
  return (
    <div
      className={clsx(
        'bg-white/95 p-4 rounded-lg transition-all duration-200',
        'border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)]',
        'backdrop-blur-[2px] backdrop-saturate-[1.8]',
        className,
      )}
      {...props}
    >
      {/* Card header */}
      <div className="mb-3">
        <Skeleton className="w-3/4 h-6" />
      </div>

      {/* Card content */}
      <div className="space-y-2">
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-5/6 h-4" />
        <Skeleton className="w-4/6 h-4" />
      </div>

      {/* Optional Footer */}
      {withFooter && (
        <div className="mt-4 pt-3 border-slate-200/70 border-t">
          <div className="flex justify-between items-center">
            <Skeleton className="w-1/4 h-4" />
            <Skeleton className="rounded-md w-20 h-8" />
          </div>
        </div>
      )}
    </div>
  );
}

export function CardSkeletonGrid(
  {
    count = 3,
    withFooter = true,
    className,
    ...props
  }: CardSkeletonProps & { count?: number; },
) {
  return (
    <div className={className} {...props}>
      {Array.from({ length: count }).map((_, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <CardSkeleton key={index} withFooter={withFooter} />
      ))}
    </div>
  );
}
