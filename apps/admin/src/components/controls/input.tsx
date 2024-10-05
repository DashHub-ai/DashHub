import clsx from 'clsx';

export function Input({ className, ...props }: JSX.IntrinsicElements['input']) {
  return (
    <input
      {...props}
      className={clsx('uk-input', className)}
    />
  );
}
