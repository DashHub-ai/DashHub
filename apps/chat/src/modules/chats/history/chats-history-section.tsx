import clsx from 'clsx';

import { useI18n } from '~/i18n';

import { ChatsContainer } from '../grid';

type Props = {
  className?: string;
};

export function ChatsHistorySection({ className }: Props) {
  const t = useI18n().pack.chats.history;

  return (
    <section className={clsx('space-y-6 mx-auto w-full max-w-5xl', className)}>
      <h2 className="font-semibold text-2xl text-center">
        {t.title}
      </h2>

      <ChatsContainer />
    </section>
  );
}
