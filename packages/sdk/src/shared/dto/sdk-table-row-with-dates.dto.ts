import { z } from 'zod';

import { SdkTimestampV } from './sdk-timestamp.dto';

export const SdkTableRowWithDatesV = z.object({
  createdAt: SdkTimestampV,
  updatedAt: SdkTimestampV,
});

export const ZodOmitDateFields = {
  createdAt: true,
  updatedAt: true,
} as const satisfies Record<keyof SdkTableRowWithDatesT, any>;

export type SdkTableRowWithDatesT = z.infer<typeof SdkTableRowWithDatesV>;
