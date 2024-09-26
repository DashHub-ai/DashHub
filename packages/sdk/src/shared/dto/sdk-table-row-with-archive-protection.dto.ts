import { z } from 'zod';

export const SdkTableRowWithArchiveProtectionV = z.object({
  archiveProtection: z.boolean(),
});

export type SdkTableRowWithArchiveProtectionT = z.infer<
  typeof SdkTableRowWithArchiveProtectionV
>;
