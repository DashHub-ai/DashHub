import type { ComponentProps } from 'react';

import clsx from 'clsx';

export type TextAreaProps = ComponentProps<'textarea'>;

export function TextArea({ className, ...props }: TextAreaProps) {
  return (
    <textarea
      {...props}
      className={clsx('bg-white uk-textarea', className)}
    />
  );
}
