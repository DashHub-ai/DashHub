import type { ReactNode } from 'react';

export type SpinnerContainerProps = {
  scale?: number;
  loading?: boolean;
  children?: () => ReactNode;
};

export function SpinnerContainer(
  {
    scale = 1.0,
    loading = true,
    children,
  }: SpinnerContainerProps,
) {
  if (!loading) {
    return <>{children?.()}</>;
  }

  return (
    <div className="flex justify-center items-center min-height-[300px]">
      <span
        className="mr-2 my-2 uk-spinner"
        role="status"
        uk-spinner={`ratio: ${scale}`}
      />
    </div>
  );
}
