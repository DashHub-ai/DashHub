import type { z } from 'zod';

import { SdkCreateAppInputV } from './sdk-create-app.dto';

export const SdkAppFromChatV = SdkCreateAppInputV.pick({
  name: true,
  description: true,
  chatContext: true,
});

export type SdkAppFromChatT = z.infer<typeof SdkAppFromChatV>;
