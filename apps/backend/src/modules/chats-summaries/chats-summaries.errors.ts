import type { SdKSearchMessagesOutputT } from '@llm/sdk';

import { TaggedError } from '@llm/commons';

export class MissingAIModelInChatError
  extends TaggedError.ofLiteral<SdKSearchMessagesOutputT>()('MissingAIModelInChat') {
}
