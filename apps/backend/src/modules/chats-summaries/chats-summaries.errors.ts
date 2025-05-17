import type { SdkSearchMessagesOutputT } from '@dashhub/sdk';

import { TaggedError } from '@dashhub/commons';

export class MissingAIModelInChatError
  extends TaggedError.ofLiteral<SdkSearchMessagesOutputT>()('MissingAIModelInChat') {
}
