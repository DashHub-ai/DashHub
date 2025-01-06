import { z } from 'zod';

import { StrictBooleanV } from '@llm/commons';
import { SdkCreateMessageInputV, SdkTableRowWithIdNameV } from '@llm/sdk';

export const StartChatFormValueV = z
  .object({
    public: StrictBooleanV,
    project: SdkTableRowWithIdNameV.nullable(),
    aiModel: SdkTableRowWithIdNameV,
  })
  .merge(SdkCreateMessageInputV);

export type StartChatFormValueT = z.infer<typeof StartChatFormValueV>;
