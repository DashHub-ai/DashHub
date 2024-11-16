import { z } from 'zod';

export const SdkTableRowUuidV = z.coerce.number();

export type SdkTableRowUuidT = z.infer<typeof SdkTableRowUuidV>;
