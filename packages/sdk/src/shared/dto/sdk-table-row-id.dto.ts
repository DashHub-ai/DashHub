import { z } from 'zod';

export const SdkTableRowIdV = z.coerce.number();

export type SdkTableRowIdT = z.infer<typeof SdkTableRowIdV>;
