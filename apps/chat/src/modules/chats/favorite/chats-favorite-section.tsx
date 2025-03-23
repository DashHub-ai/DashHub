import clsx from 'clsx';

import { useSdkForLoggedIn } from '@llm/sdk';
import { useI18n } from '~/i18n';

import { ChatsContainer } from '../grid';

type Props = {
  className?: string;
};

export function ChatsFavoriteSection({ className }: Props) {
  const t = useI18n().pack.chats.favorite;
  const { session } = useSdkForLoggedIn();
  return (
    <section className={clsx('space-y-6 mx-auto w-full max-w-5xl', className)}>
      <h2 className="font-semibold text-2xl text-center">
        {t.title}
      </h2>

      <ChatsContainer
        limit={4}
        withAutoRefresh={false}
        filters={{
          creatorIds: [session.token.sub],
          excludeEmpty: true,
          favorites: true,
          sort: 'favorites:desc',
        }}
        itemPropsFn={() => ({
          withPermissions: false,
        })}
        paginationToolbarProps={{
          suffix: null,
        }}
      />
    </section>
  );
}
