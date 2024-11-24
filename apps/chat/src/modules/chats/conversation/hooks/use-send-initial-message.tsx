import { pipe } from 'fp-ts/lib/function';

import type { SdkCreateMessageInputT, SdkRequestAIReplyInputT } from '@llm/sdk';

import { tapEither, tryParseUsingZodSchema } from '@llm/commons';
import { useAfterMount } from '@llm/commons-front';

import { StartChatFormValueV } from '../../start-chat/use-start-chat-form';

export function useSendInitialMessage(
  onReply: (input: SdkCreateMessageInputT & SdkRequestAIReplyInputT) => unknown,
) {
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
