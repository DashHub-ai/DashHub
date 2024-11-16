import clsx from 'clsx';

import { ChatCard } from './chat-card';

type Props = {
  className?: string;
};

export function ChatsHistorySection({ className }: Props) {
  return (
    <section className={clsx('space-y-6 mx-auto w-full max-w-5xl', className)}>
      <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <ChatCard
          title="Example Chat"
          project={{
            id: 1,
            name: 'Project X',
          }}
          createdAt={new Date()}
        />

        <ChatCard
          title="Example Chat 2"
          project={{
            id: 1,
            name: 'Project X',
          }}
          createdAt={new Date()}
        />

        <ChatCard
          title="Example Chat 3"
          project={{
            id: 1,
            name: 'Project X',
          }}
          createdAt={new Date()}
        />

        <ChatCard
          title="Example Chat 4"
          project={{
            id: 1,
            name: 'Project X',
          }}
          createdAt={new Date()}
        />

        <ChatCard
          title="Example Chat 5"
          project={{
            id: 1,
            name: 'Project X',
          }}
          createdAt={new Date()}
        />

        <ChatCard
          title="Example Chat 6"
          project={{
            id: 1,
            name: 'Project X',
          }}
          createdAt={new Date()}
        />

        <ChatCard
          title="Example Chat 7"
          project={{
            id: 1,
            name: 'Project X',
          }}
          createdAt={new Date()}
        />

        <ChatCard
          title="Example Chat 8"
          project={{
            id: 1,
            name: 'Project X',
          }}
          createdAt={new Date()}
        />

        <ChatCard
          title="Example Chat 9"
          project={{
            id: 1,
            name: 'Project X',
          }}
          createdAt={new Date()}
        />
      </div>
    </section>
  );
}
