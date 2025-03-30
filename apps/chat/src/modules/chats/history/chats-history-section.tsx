import clsx from 'clsx';

import { useSdkForLoggedIn } from '@llm/sdk';

import { ChatsContainer } from '../grid';

type Props = {
  className?: string;
};

export function ChatsHistorySection({ className }: Props) {
  const { session } = useSdkForLoggedIn();

  return (
    <section className={clsx('space-y-6 w-full', className)}>
      <ChatsContainer
        limit={15}
        columns={3}
        filters={{
          creatorIds: [session.token.sub],
          excludeEmpty: true,
        }}

        itemPropsFn={() => ({
          withPermissions: false,
        })}
      />
    </section>
  );
}
