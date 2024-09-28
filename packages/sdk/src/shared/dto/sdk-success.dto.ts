import { z } from 'zod';

export const SdkSuccessV = z.object({
  success: z.literal(true),
});

export type SdkSuccessT = z.infer<typeof SdkSuccessV>;

export function ofSdkSuccess(): SdkSuccessT {
  return {
    success: true,
  };
}
