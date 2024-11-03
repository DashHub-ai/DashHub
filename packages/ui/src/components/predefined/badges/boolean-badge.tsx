import { clsx } from 'clsx';

import { useForwardedI18n } from '~/i18n';

type Props = {
  value: boolean;
};

export function BooleanBadge({ value }: Props) {
  const t = useForwardedI18n().pack.badges.boolean;

  return (
    <span className={clsx('uk-badge', {
      'uk-badge-secondary': value,
      'uk-badge-danger': !value,
    })}
    >
      {t[value ? 'yes' : 'no']}
    </span>
  );
}
