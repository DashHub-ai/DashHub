import { FileWarningIcon, type LucideProps } from 'lucide-react';
import dynamicIconImports from 'lucide-react/dynamicIconImports';
import { lazy, memo, Suspense } from 'react';

type IconProps =
  & Omit<LucideProps, 'ref'>
  & {
    name: keyof typeof dynamicIconImports;
  };

export const LazyIcon = memo(({ name, ...props }: IconProps) => {
  const LucideIcon = name in dynamicIconImports ? lazy(dynamicIconImports[name]) : FileWarningIcon;

  return (
    <Suspense fallback={<div style={{ width: 24, height: 24 }} />}>
      <LucideIcon {...props} />
    </Suspense>
  );
});
