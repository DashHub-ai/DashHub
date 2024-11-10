import clsx from 'clsx';

import { useForwardedI18n } from '~/i18n';

type Props = Omit<JSX.IntrinsicElements['button'], 'children'>;

export function CancelButton({ className, ...props }: Props) {
  const { pack } = useForwardedI18n();

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