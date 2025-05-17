import { z } from 'zod';

import { StrictBooleanV } from '@dashhub/commons';
import { SdkCreateMessageInputV, SdkTableRowWithIdNameV } from '@dashhub/sdk';

export const StartChatFormValueV = z
  .object({
    public: StrictBooleanV,
    project: SdkTableRowWithIdNameV.nullable(),
    aiModel: SdkTableRowWithIdNameV,
  })
  .merge(SdkCreateMessageInputV);

export type StartChatFormValueT = z.infer<typeof StartChatFormValueV>;
