import type { ComponentProps } from 'react';

import clsx from 'clsx';

export type InputProps = ComponentProps<'input'>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      {...props}
      className={clsx('bg-white uk-input', className)}
    />
  );
}
