import camelcaseKeys from 'camelcase-keys';

import type { CamelCaseToSnakeCaseObject } from '@llm/commons';
import type { SdkPermissionsT, SdkPermissionT } from '@llm/sdk';

export type EsPermissionsDocument = CamelCaseToSnakeCaseObject<{
  inherited: SdkPermissionT[];
  current: SdkPermissionT[];
}>;

export function mapRawEsDocToSdkPermissions(rawDoc: EsPermissionsDocument): SdkPermissionsT {
  return {
    inherited: mapRawEsDocToSdkPermissionsList(rawDoc.inherited),
    current: mapRawEsDocToSdkPermissionsList(rawDoc.current),
  };
}

function mapRawEsDocToSdkPermissionsList(rawDocs: CamelCaseToSnakeCaseObject<SdkPermissionT>[]): SdkPermissionT[] {
  return rawDocs.map(doc => ({
    accessLevel: doc.access_level,
    target: camelcaseKeys(doc.target, { deep: true }),
  }));
}
