import type { CamelCaseToSnakeCaseObject } from '@llm/commons';
import type { SdkPermissionsT, SdkPermissionT } from '@llm/sdk';

export type EsPermissionsDocument = CamelCaseToSnakeCaseObject<{
  inherited: SdkPermissionsT;
  current: SdkPermissionsT;
}>;

export function mapRawEsDocToSdkPermissions(rawDoc: EsPermissionsDocument): SdkPermissionT[] {
  return rawDoc.current.map(doc => ({
    accessLevel: doc.access_level,
    target: doc.target,
  }));
}
