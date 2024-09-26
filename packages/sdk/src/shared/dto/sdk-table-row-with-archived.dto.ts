import { z } from 'zod';

export const SdkTableRowWithArchivedV = z.object({
  archived: z.boolean(),
});

export const ZodOmitArchivedFields = {
  archived: true,
} as const satisfies Record<keyof SdkTableRowWithArchivedT, any>;

export type SdkTableRowWithArchivedT = z.infer<
  typeof SdkTableRowWithArchivedV
>;
