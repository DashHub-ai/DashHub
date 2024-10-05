import { clsx } from 'clsx';

import { useI18n } from '~/i18n';

type Props = {
  archived: boolean;
};

export function ArchivedBadge({ archived }: Props) {
  const t = useI18n().pack.badges.archive;

  return (
    <span className={clsx('uk-badge', {
      'uk-badge-secondary': !archived,
      'uk-badge-danger': archived,
    })}
    >
      {t[archived ? 'archived' : 'active']}
    </span>
  );
}
