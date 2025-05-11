import type { z } from 'zod';

import { pipe } from 'fp-ts/lib/function';

import { tapEither, tryParseUsingZodSchema } from '@dashhub/commons';
import { useAfterMount } from '@dashhub/commons-front';
import { SdkCreateMessageInputV, SdkTableRowWithIdNameV } from '@dashhub/sdk';

const InitialChatMessageV = SdkCreateMessageInputV
  .omit({
    replyToMessageId: true,
  })
  .extend({
    aiModel: SdkTableRowWithIdNameV,
  });

export type InitialChatMessageT = z.TypeOf<typeof InitialChatMessageV>;

export function useSendInitialMessage(onReply: (input: InitialChatMessageT) => unknown) {
  useAfterMount(() => {
    pipe(
      history.state?.message,
      tryParseUsingZodSchema(InitialChatMessageV),
      tapEither((data) => {
        history.replaceState(undefined, '', location.pathname);
        onReply(data);
      }),
    );
  });
}
