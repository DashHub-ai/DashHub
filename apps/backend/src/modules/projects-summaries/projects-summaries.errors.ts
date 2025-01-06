import type { SdkSearchMessagesOutputT } from '@llm/sdk';

import { TaggedError } from '@llm/commons';

export class MissingAIModelInProjectError
  extends TaggedError.ofLiteral<SdkSearchMessagesOutputT>()('MissingAIModelInProject') {
}
