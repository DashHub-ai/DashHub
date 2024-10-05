import clsx from 'clsx';

import { useI18n } from '~/i18n';

type Props = Omit<JSX.IntrinsicElements['button'], 'children'>;

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
