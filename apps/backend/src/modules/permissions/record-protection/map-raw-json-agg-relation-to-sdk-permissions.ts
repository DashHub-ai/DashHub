import type { SdkPermissionAccessLevelT, SdkPermissionT } from '@llm/sdk';
import type { TableId } from '~/modules/database';

export type PermissionsTableRowRawAggRelation = {
  access_level: SdkPermissionAccessLevelT;

  group_id: TableId | null;
  group_name: string | null;

  user_id: TableId | null;
  user_email: string | null;
  user_name: string | null;
};

export function mapRawJSONAggRelationToSdkPermissions(rawRelationRow: PermissionsTableRowRawAggRelation): SdkPermissionT {
  if (rawRelationRow.group_id) {
    return {
      accessLevel: rawRelationRow.access_level,
      target: {
        group: {
          id: rawRelationRow.group_id,
          name: rawRelationRow.group_name!,
        },
      },
    };
  }

  return {
    accessLevel: rawRelationRow.access_level,
    target: {
      user: {
        id: rawRelationRow.user_id!,
        email: rawRelationRow.user_email!,
        name: rawRelationRow.user_name!,
      },
    },
  };
}
