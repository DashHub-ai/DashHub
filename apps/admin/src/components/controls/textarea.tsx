import clsx from 'clsx';

export type TextAreaProps = JSX.IntrinsicElements['textarea'];

export function TextArea({ className, ...props }: TextAreaProps) {
  return (
    <textarea
      {...props}
      className={clsx('uk-textarea', className)}
    />
  );
}
