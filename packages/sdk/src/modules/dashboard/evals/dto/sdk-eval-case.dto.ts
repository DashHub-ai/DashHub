import { z } from 'zod';

import { NonEmptyOrNullStringV } from '@dashhub/commons';
import { SdkTableRowIdV, SdkTableRowWithDatesV, SdkTableRowWithIdV } from '~/shared';

export const SdkEvalCaseV = z.object({
  suiteId: SdkTableRowIdV,
  inputMessage: z.string().min(1),
  expectedNote: NonEmptyOrNullStringV,
})
  .merge(SdkTableRowWithIdV)
  .merge(SdkTableRowWithDatesV);

export type SdkEvalCaseT = z.infer<typeof SdkEvalCaseV>;

export const SdkCreateEvalCaseInputV = z.object({
  suiteId: SdkTableRowIdV,
  inputMessage: z.string().min(1),
  expectedNote: NonEmptyOrNullStringV,
});

export type SdkCreateEvalCaseInputT = z.infer<typeof SdkCreateEvalCaseInputV>;

export const SdkCreateEvalCaseOutputV = SdkTableRowWithIdV;

export type SdkCreateEvalCaseOutputT = z.infer<typeof SdkCreateEvalCaseOutputV>;
