import clsx from 'clsx';

export type InputProps = JSX.IntrinsicElements['input'];

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      {...props}
      className={clsx('bg-white uk-input', className)}
    />
  );
}
