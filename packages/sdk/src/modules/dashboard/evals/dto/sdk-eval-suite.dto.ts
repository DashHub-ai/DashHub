import { z } from 'zod';

import { NonEmptyOrNullStringV } from '@dashhub/commons';
import {
  SdkTableRowWithDatesV,
  SdkTableRowWithIdNameV,
  SdkTableRowWithIdV,
} from '~/shared';

export const SdkEvalSuiteV = z.object({
  organization: SdkTableRowWithIdNameV,
  description: NonEmptyOrNullStringV,
})
  .merge(SdkTableRowWithIdNameV)
  .merge(SdkTableRowWithDatesV);

export type SdkEvalSuiteT = z.infer<typeof SdkEvalSuiteV>;

export const SdkCreateEvalSuiteInputV = z.object({
  name: z.string().min(1),
  description: NonEmptyOrNullStringV,
  organization: SdkTableRowWithIdV,
});

export type SdkCreateEvalSuiteInputT = z.infer<typeof SdkCreateEvalSuiteInputV>;

export const SdkCreateEvalSuiteOutputV = SdkTableRowWithIdV;

export type SdkCreateEvalSuiteOutputT = z.infer<typeof SdkCreateEvalSuiteOutputV>;
