import { z } from 'zod';

export const SdkTimestampV = z.coerce.date();

export type SdkTimestampT = z.infer<typeof SdkTimestampV>;
