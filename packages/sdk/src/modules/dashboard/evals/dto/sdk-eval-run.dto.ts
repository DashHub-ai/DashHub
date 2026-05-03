import { z } from 'zod';

import { SdkTableRowIdV, SdkTableRowWithDatesV, SdkTableRowWithIdV } from '~/shared';

export const SDK_EVAL_RUN_STATUSES = ['pending', 'running', 'completed', 'failed'] as const;

export const SdkEvalRunStatusV = z.enum(SDK_EVAL_RUN_STATUSES);

export type SdkEvalRunStatusT = z.infer<typeof SdkEvalRunStatusV>;

export const SdkEvalRunV = z.object({
  suiteId: SdkTableRowIdV,
  aiModelId: SdkTableRowIdV,
  status: SdkEvalRunStatusV,
})
  .merge(SdkTableRowWithIdV)
  .merge(SdkTableRowWithDatesV);

export type SdkEvalRunT = z.infer<typeof SdkEvalRunV>;

export const SdkCreateEvalRunInputV = z.object({
  suiteId: SdkTableRowIdV,
  aiModelId: SdkTableRowIdV,
});

export type SdkCreateEvalRunInputT = z.infer<typeof SdkCreateEvalRunInputV>;

export const SdkCreateEvalRunOutputV = SdkTableRowWithIdV;

export type SdkCreateEvalRunOutputT = z.infer<typeof SdkCreateEvalRunOutputV>;

export const SdkEvalResultV = z.object({
  runId: SdkTableRowIdV,
  caseId: SdkTableRowIdV,
  aiResponse: z.string().nullable(),
  latencyMs: z.number().int().nullable(),
  errorMessage: z.string().nullable(),
})
  .merge(SdkTableRowWithIdV)
  .merge(SdkTableRowWithDatesV);

export type SdkEvalResultT = z.infer<typeof SdkEvalResultV>;
