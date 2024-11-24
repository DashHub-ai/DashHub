import { pipe } from 'fp-ts/lib/function';

import type { SdkCreateMessageInputT, SdkRequestAIReplyInputT } from '@llm/sdk';

import { tapEither, tryParseUsingZodSchema } from '@llm/commons';
import { useAfterMount } from '@llm/commons-front';

import { StartChatFormValueV } from '../../start-chat/use-start-chat-form';

export function useSendInitialMessage(
  onReply: (input: SdkCreateMessageInputT & SdkRequestAIReplyInputT) => unknown,
) {
  useAfterMount(() => {
    const maybeMessage = history.state?.message;

    delete history.state?.message;

    pipe(
      maybeMessage,
      tryParseUsingZodSchema(StartChatFormValueV),
      tapEither(onReply),
    );
  });
}
