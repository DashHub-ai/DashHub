import type { ComponentProps } from 'react';

import clsx from 'clsx';

import { useI18n } from '~/i18n';

type Props = Omit<ComponentProps<'button'>, 'children'>;

export function ResetFiltersButton({ className, ...props }: Props) {
  const { pack } = useI18n();

  return (
    <button
      type="button"
      className={clsx('shrink-0 uk-button uk-button-default uk-button-small', className)}
      {...props}
    >
      {pack.buttons.resetFilters}
    </button>
  );
}
