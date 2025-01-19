import type { ComponentProps } from 'react';

import clsx from 'clsx';

import { useForwardedI18n } from '~/i18n';

type Props = Omit<ComponentProps<'button'>, 'children'>;

export function ResetFiltersButton({ className, ...props }: Props) {
  const { pack } = useForwardedI18n();

  return (
    <button
      type="button"
      className={clsx('shrink-0 uk-button uk-button-default', className)}
      {...props}
    >
      {pack.buttons.resetFilters}
    </button>
  );
}
