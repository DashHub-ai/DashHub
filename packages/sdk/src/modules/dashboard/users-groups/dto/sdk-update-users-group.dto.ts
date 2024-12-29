import type { z } from 'zod';

import { SdkTableRowWithIdV, ZodOmitArchivedFields, ZodOmitDateFields } from '~/shared';

import { SdkUsersGroupV } from './sdk-users-group.dto';

export const SdkUpdateUsersGroupInputV = SdkUsersGroupV.omit({
  ...ZodOmitDateFields,
  ...ZodOmitArchivedFields,
  id: true,
  organization: true,
  creator: true,
});

export type SdkUpdateUsersGroupInputT = z.infer<typeof SdkUpdateUsersGroupInputV>;

export const SdkUpdateUsersGroupOutputV = SdkTableRowWithIdV;

export type SdkUpdateUsersGroupOutputT = z.infer<typeof SdkUpdateUsersGroupOutputV>;
