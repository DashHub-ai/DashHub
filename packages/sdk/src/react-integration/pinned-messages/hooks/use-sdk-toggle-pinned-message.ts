import { array as A, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { useRef, useState } from 'react';

import type { SdkPinMessageInputT, SdkPinMessageListItemT } from '~/modules';

import { isNil, TaggedError, tapTaskEither, tapTaskEitherError } from '@llm/commons';
import { useSdkForLoggedIn } from '~/react-integration/hooks';

import { useSdkPinnedMessagesContextOrThrow } from '../sdk-pinned-messages-context';

export class SdkPinnedMessagesStillLoadingError extends TaggedError.ofLiteral()('messages-list-still-loading') {}

export function useSdkTogglePinnedMessage() {
  const store = useSdkPinnedMessagesContextOrThrow();
  const { sdks } = useSdkForLoggedIn();

  const currentMigrationId = useRef<string | null>(null);
  const [loading, setLoading] = useState(false);

  const optimisticUpdate = (
    {
      optimisticUpdateFn,
      asyncExecutor,
    }: {
      optimisticUpdateFn: (initialMessages: SdkPinMessageListItemT[]) => SdkPinMessageListItemT[];
      asyncExecutor: () => TE.TaskEither<TaggedError<string>, unknown>;
    },
  ) => pipe(
    TE.Do,
    TE.bind('migrationId', () => TE.fromIO(() => {
      currentMigrationId.current = Date.now().toString();
      setLoading(true);

      return currentMigrationId.current;
    })),
    TE.bindW('initialMessages', () => {
      const snapshot = store.getSnapshot();

      if (snapshot.loading) {
        return TE.left(new SdkPinnedMessagesStillLoadingError({}));
      }

      return TE.right(snapshot.items);
    }),
    tapTaskEither(({ initialMessages }) => {
      store.notify({
        loading: false,
        items: optimisticUpdateFn(initialMessages),
      });
    }),
    TE.bindW('result', ({ migrationId, initialMessages }) => pipe(
      asyncExecutor(),
      TE.chainW(() => sdks.dashboard.pinnedMessages.all()),
      tapTaskEither((newItems) => {
        if (currentMigrationId.current !== migrationId) {
          return;
        }

        store.notify({
          loading: false,
          items: newItems,
        });

        setLoading(false);
      }),
      tapTaskEitherError((error) => {
        console.error(error);

        store.notify({
          loading: false,
          items: initialMessages,
        });

        setLoading(false);
      }),
    )),
  );

  const pin = ({ messageId }: SdkPinMessageInputT) => optimisticUpdate({
    asyncExecutor: () => sdks.dashboard.pinnedMessages.create({
      messageId,
    }),
    optimisticUpdateFn: initialMessages => pipe(
      initialMessages,
      A.filter(message => message.messageId !== messageId),
      A.append({
        id: Date.now(),
        messageId,
      }),
    ),
  });

  const unpin = ({ messageId }: SdkPinMessageInputT) => {
    const snapshot = store.getSnapshot();

    if (snapshot.loading) {
      return TE.left(new SdkPinnedMessagesStillLoadingError({}));
    }

    const id = snapshot.items.find(message => message.messageId === messageId)?.id;

    if (isNil(id)) {
      return TE.of(undefined);
    }

    return optimisticUpdate({
      asyncExecutor: () => sdks.dashboard.pinnedMessages.delete({ id }),
      optimisticUpdateFn: initialMessages => pipe(
        initialMessages,
        A.filter(message => message.id !== id),
      ),
    });
  };

  return {
    loading,
    pin,
    unpin,
  };
}
