import clsx from 'clsx';

type Props = JSX.IntrinsicElements['button'] & {
  loading: boolean;
};

export function FormSpinnerCTA({ loading, className, children, ...props }: Props) {
  return (
    <button
      type="submit"
      className={clsx('uk-button uk-button-primary', className)}
      disabled={loading}
      {...props}
    >
      {loading && (
        <span
          className="mr-2 uk-icon uk-spinner"
          role="status"
          uk-spinner="ratio: 0.54"
        />
      )}

      {children}
    </button>
  );
}
