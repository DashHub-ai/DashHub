import { z } from 'zod';

import { SdkTableRowIdV } from '~/shared';

export const SdkMessageAsyncFunctionResultV = z.object({
  externalApiId: SdkTableRowIdV,
  functionName: z.string(),
  args: z.object({}).catchall(z.any()),
  result: z.object({}).catchall(z.any()),
});

export type SdkMessageAsyncFunctionResultT = z.infer<typeof SdkMessageAsyncFunctionResultV>;
