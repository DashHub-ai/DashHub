import type { ComponentProps } from 'react';

import clsx from 'clsx';

import { useI18n } from '~/i18n';

type Props = Omit<ComponentProps<'button'>, 'children'>;

export function CancelButton({ className, ...props }: Props) {
  const { pack } = useI18n();

  return (
    <button
      type="button"
      className={clsx('uk-button uk-button-default', className)}
      {...props}
    >
      {pack.buttons.cancel}
    </button>
  );
}
