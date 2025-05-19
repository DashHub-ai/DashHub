import type { SdkSearchMessagesOutputT } from '@dashhub/sdk';

import { TaggedError } from '@dashhub/commons';

export class MissingAIModelInProjectError
  extends TaggedError.ofLiteral<SdkSearchMessagesOutputT>()('MissingAIModelInProject') {
}
