import type { z } from 'zod';

import { ZodOmitArchivedFields, ZodOmitDateFields } from '~/shared';

import { SdkOrganizationV } from './sdk-organization.dto';

export const SdkCreateOrganizationV = SdkOrganizationV.omit({
  ...ZodOmitDateFields,
  ...ZodOmitArchivedFields,
  id: true,
});

export type SdkCreateOrganizationT = z.infer<typeof SdkCreateOrganizationV>;
