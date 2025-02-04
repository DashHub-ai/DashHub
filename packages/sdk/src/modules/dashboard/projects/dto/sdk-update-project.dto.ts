import type { z } from 'zod';

import {
  type SdkTableRowWithIdT,
  SdkTableRowWithIdV,
  ZodOmitArchivedFields,
  ZodOmitDateFields,
} from '~/shared';

import { SdkUpsertTableRowWithPermissionsInputV } from '../../permissions/dto/sdk-upsert-table-row-with-permissions.dto';
import { SdkProjectSummaryInputV } from './sdk-create-project.dto';
import { type SdkProjectT, SdkProjectV } from './sdk-project.dto';

export const SdkUpdateProjectInputV = SdkProjectV.omit({
  ...ZodOmitDateFields,
  ...ZodOmitArchivedFields,
  id: true,
  organization: true,
  summary: true,
  permissions: true,
})
  .merge(SdkUpsertTableRowWithPermissionsInputV)
  .extend({
    summary: SdkProjectSummaryInputV,
  });

export type SdkUpdateProjectInputT = z.infer<typeof SdkUpdateProjectInputV>;

export const SdkUpdateProjectOutputV = SdkTableRowWithIdV;

export type SdkUpdateProjectOutputT = z.infer<typeof SdkUpdateProjectOutputV>;

export function castSdkProjectToUpdateInput(project: SdkProjectT): SdkUpdateProjectInputT & SdkTableRowWithIdT {
  return {
    ...project,
    permissions: project.permissions?.current,
    summary: {
      content: (
        project.summary.content.generated
          ? { generated: true, value: null }
          : { generated: false, value: project.summary.content.value! }
      ),
    },
  };
}
