import type { CamelCaseToSnakeCaseObject } from '@llm/commons';
import type { SdkPermissionT } from '@llm/sdk';

type ESPermissionRawDoc = CamelCaseToSnakeCaseObject<SdkPermissionT>;

export function mapRawEsDocToSdkPermissions(rawDoc: ESPermissionRawDoc[]): SdkPermissionT[] {
  return rawDoc.map(doc => ({
    accessLevel: doc.access_level,
    target: doc.target,
  }));
}
