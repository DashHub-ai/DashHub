import clsx from 'clsx';

import { Tabs } from '@llm/ui';

import { ChatCard } from './chat-card';

type Props = {
  className?: string;
};

export function ChatsHistorySection({ className }: Props) {
  return (
    <section className={clsx('space-y-6 mx-auto w-full max-w-4xl', className)}>
      <div className="flex items-center space-x-2 mx-auto max-w-[300px]">
        <Tabs
          defaultValue={1}
          tabs={[
            {
              id: 1,
              name: 'Your Chats',
            },
            {
              id: 2,
              name: 'Recent Chats',
            },
          ]}
        />
      </div>

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
