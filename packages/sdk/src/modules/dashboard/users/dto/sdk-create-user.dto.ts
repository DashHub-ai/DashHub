import type { z } from 'zod';

import { SdkCreateOrganizationUserV } from '~/modules/dashboard/organizations/dto/sdk-create-organization-user.dto';
import { ZodOmitArchivedFields, ZodOmitDateFields } from '~/shared';

import { SdkCreateUserAuthMethodsV } from './auth';
import { SdkUserV } from './sdk-user.dto';

export const SdkCreateUserV = SdkUserV
  .omit({
    ...ZodOmitDateFields,
    ...ZodOmitArchivedFields,
    id: true,
    auth: true,
  })
  .extend({
    auth: SdkCreateUserAuthMethodsV,
    organization: SdkCreateOrganizationUserV
      .omit({
        user: true,
      })
      .optional(),
  });

export type SdkCreateUserT = z.infer<typeof SdkCreateUserV>;
