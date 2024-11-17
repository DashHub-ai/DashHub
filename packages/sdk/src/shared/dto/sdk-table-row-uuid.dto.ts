import { z } from 'zod';

export const SdkTableRowUuidV = z.coerce.string();

export type SdkTableRowUuidT = z.infer<typeof SdkTableRowUuidV>;
