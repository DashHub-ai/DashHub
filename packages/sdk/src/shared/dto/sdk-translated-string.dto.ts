import { z } from 'zod';

export const SdkTranslatedStringV = z.record(z.string(), z.string());

export type SdkTranslatedStringT = z.TypeOf<typeof SdkTranslatedStringV>;
