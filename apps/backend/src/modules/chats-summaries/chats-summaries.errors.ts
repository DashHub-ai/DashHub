import type { SdkSearchMessagesOutputT } from '@llm/sdk';

import { TaggedError } from '@llm/commons';

export class MissingAIModelInChatError
  extends TaggedError.ofLiteral<SdkSearchMessagesOutputT>()('MissingAIModelInChat') {
}
