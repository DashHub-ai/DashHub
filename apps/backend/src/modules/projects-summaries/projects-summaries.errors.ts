import type { SdKSearchMessagesOutputT } from '@llm/sdk';

import { TaggedError } from '@llm/commons';

export class MissingAIModelInProjectError
  extends TaggedError.ofLiteral<SdKSearchMessagesOutputT>()('MissingAIModelInProject') {
}
