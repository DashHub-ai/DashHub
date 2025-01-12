import type { ComponentProps } from 'react';

import clsx from 'clsx';

export type FormSpinnerCTAProps = ComponentProps<'button'> & {
  loading: boolean;
  buttonTypeClass?: string;
};

export function FormSpinnerCTA(
  {
    loading,
    className,
    buttonTypeClass = 'uk-button-primary',
    children,
    ...props
  }: FormSpinnerCTAProps,
) {
  return (
    <button
      type="submit"
      className={clsx('uk-button', buttonTypeClass, className)}
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
