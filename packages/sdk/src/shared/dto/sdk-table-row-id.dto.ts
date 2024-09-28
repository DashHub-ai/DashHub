import { z } from 'zod';

export const SdkTableRowIdV = z.number();

export type SdkTableRowIdT = z.infer<typeof SdkTableRowIdV>;
