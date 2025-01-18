import type { MouseEventHandler } from 'react';

import clsx from 'clsx';
import { StarIcon } from 'lucide-react';

import type { SdkTableRowWithIdT } from '@llm/sdk';

import { useI18n } from '~/i18n';

import { useFavoriteApps } from './use-favorite-apps';

type Props = {
  app: SdkTableRowWithIdT;
  className?: string;
};

export function FavoriteAppStarButton({ app, className }: Props) {
  const t = useI18n().pack;
  const { isFavorite, toggle } = useFavoriteApps();

  const favorite = isFavorite(app);

  const onClick: MouseEventHandler = (event) => {
    event.stopPropagation();
    toggle(app);
  };

  return (
    <button
      type="button"
      className={clsx(
        className,
        favorite
          ? 'text-yellow-500 hover:text-yellow-600'
          : 'text-muted-foreground hover:text-primary',
      )}
      title={t.apps.favorites[favorite ? 'remove' : 'add']}
      aria-label={t.apps.favorites[favorite ? 'remove' : 'add']}
      onClick={onClick}
    >
      <StarIcon
        size={20}
        {...favorite ? { strokeWidth: 0, fill: 'currentColor' } : {}}
      />
    </button>
  );
}
