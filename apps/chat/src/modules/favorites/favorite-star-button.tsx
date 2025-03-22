import clsx from 'clsx';
import { pipe } from 'fp-ts/lib/function';
import { StarIcon } from 'lucide-react';

import { tapTaskEitherError, toVoidTE, tryOrThrowTE } from '@llm/commons';
import { useAsyncCallback } from '@llm/commons-front';
import { type SdkFavoriteT, useIsSdkFavoriteToggled, useSdkToggleFavorite } from '@llm/sdk';
import { useI18n } from '~/i18n';
import { useSaveErrorNotification } from '~/ui';

type Props = {
  favorite: SdkFavoriteT;
  className?: string;
};

export function FavoriteStarButton({ favorite, className }: Props) {
  const t = useI18n().pack;
  const isPinned = useIsSdkFavoriteToggled(favorite);
  const { pin, unpin } = useSdkToggleFavorite();

  const showErrorNotification = useSaveErrorNotification();
  const [handlePin, pinState] = useAsyncCallback(
    pipe(
      isPinned
        ? toVoidTE(unpin(favorite))
        : toVoidTE(pin(favorite)),
      tapTaskEitherError(showErrorNotification),
      tryOrThrowTE,
    ),
  );

  return (
    <button
      type="button"
      disabled={pinState.isLoading}
      className={clsx(
        className,
        isPinned
          ? 'text-yellow-500 hover:text-yellow-600'
          : 'text-muted-foreground hover:text-primary',
      )}
      title={t.apps.favorites[favorite ? 'remove' : 'add']}
      aria-label={t.apps.favorites[favorite ? 'remove' : 'add']}
      onClick={handlePin}
    >
      <StarIcon
        size={20}
        {...isPinned ? { fill: 'currentColor' } : {}}
      />
    </button>
  );
}
