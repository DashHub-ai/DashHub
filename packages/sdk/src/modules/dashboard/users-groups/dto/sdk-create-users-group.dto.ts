import { z } from 'zod';

import { SdkTableRowWithIdV, ZodOmitArchivedFields, ZodOmitDateFields } from '~/shared';

import { SdkUsersGroupV } from './sdk-users-group.dto';

export const SdkCreateUsersGroupInputV = SdkUsersGroupV
  .omit({
    ...ZodOmitDateFields,
    ...ZodOmitArchivedFields,
    id: true,
    organization: true,
    creator: true,
  })
  .extend({
    organization: SdkTableRowWithIdV,
    users: z.array(SdkTableRowWithIdV),
  });

export type SdkCreateUsersGroupInputT = z.infer<typeof SdkCreateUsersGroupInputV>;

export const SdkCreateUsersGroupOutputV = SdkTableRowWithIdV;

export type SdkCreateUsersGroupOutputT = z.infer<typeof SdkCreateUsersGroupOutputV>;
