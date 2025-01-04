import type { SdkPermissionTargetT } from '@llm/sdk';

import { TaggedError } from '@llm/commons';

export class IncorrectPermissionTargetError
  extends TaggedError.ofLiteral<Partial<SdkPermissionTargetT>>()('IncorrectPermissionResourceError') {
}
