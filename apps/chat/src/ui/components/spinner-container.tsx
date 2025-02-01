import type { ReactNode } from 'react';

import clsx from 'clsx';

export type SpinnerContainerProps = {
  scale?: number;
  loading?: boolean;
  children?: () => ReactNode;
  className?: string;
};

export function SpinnerContainer(
  {
    scale = 1.0,
    loading = true,
    children,
    className,
  }: SpinnerContainerProps,
) {
  if (!loading) {
    return <>{children?.()}</>;
  }

  return (
    <div className={clsx('flex justify-center items-center min-height-[300px]', className)}>
      <span
        className="my-2 mr-2 uk-spinner"
        role="status"
        uk-spinner={`ratio: ${scale}`}
      />
    </div>
  );
}
