import type { ReactNode } from 'react';

import clsx from 'clsx';

import { Input, type InputProps } from './input';

export type InputWithIconProps = InputProps & {
  icon: ReactNode;
};

export function InputWithIcon(
  {
    icon,
    className,
    ...props
  }: InputWithIconProps,
) {
  return (
    <div className={clsx('relative w-full max-w-md', className)}>
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        {icon}
      </div>
      <Input
        {...props}
        className="block w-full p-4 pl-10"
      />
    </div>
  );
}
