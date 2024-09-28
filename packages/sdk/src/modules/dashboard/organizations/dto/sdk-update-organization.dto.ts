import type { z } from 'zod';

import { SdkTableRowWithIdV, ZodOmitArchivedFields, ZodOmitDateFields } from '~/shared';

import { SdkOrganizationV } from './sdk-organization.dto';

export const SdkUpdateOrganizationInputV = SdkOrganizationV.omit({
  ...ZodOmitDateFields,
  ...ZodOmitArchivedFields,
  id: true,
});

export type SdkUpdateOrganizationInputT = z.infer<typeof SdkUpdateOrganizationInputV>;

export const SdkUpdateOrganizationOutputV = SdkTableRowWithIdV;

export type SdkUpdateOrganizationOutputT = z.infer<typeof SdkUpdateOrganizationOutputV>;
