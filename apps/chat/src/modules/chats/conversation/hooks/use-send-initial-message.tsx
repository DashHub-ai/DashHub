import { pipe } from 'fp-ts/lib/function';

import { tapEither, tryParseUsingZodSchema } from '@llm/commons';
import { useAfterMount } from '@llm/commons-front';

import { type StartChatFormValueT, StartChatFormValueV } from '../../start-chat/use-start-chat-form';

export function useSendInitialMessage(onReply: (input: Omit<StartChatFormValueT, 'replyToMessage'>) => unknown) {
  useAfterMount(() => {
    pipe(
      history.state?.message,
      tryParseUsingZodSchema(StartChatFormValueV),
      tapEither((data) => {
        history.replaceState(undefined, '', location.pathname);
        onReply(data);
      }),
    );
  });
}
