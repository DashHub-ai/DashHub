import esb from 'elastic-builder';

import type { SdkPermissionAccessLevelT, SdkTableRowIdT } from '@llm/sdk';

type UserAccessPermissionsDescriptor = {
  accessLevel: SdkPermissionAccessLevelT;
  userId: SdkTableRowIdT;
  groupsIds: SdkTableRowIdT[];
};

export type WithPermissionsInternalFilters<O = unknown> = O & {
  satisfyPermissions?: UserAccessPermissionsDescriptor;
};

export function createEsPermissionsFilters(descriptor: UserAccessPermissionsDescriptor): esb.BoolQuery {
  const { userId, groupsIds, accessLevel } = descriptor;

  const accessLevels = accessLevel === 'read'
    ? ['read', 'write'] // if requesting read, allow both read and write
    : [accessLevel]; // if requesting write, only allow write

  return esb.boolQuery().should([
    // Case 1: No permissions field means public access
    esb.boolQuery().mustNot(esb.existsQuery('permissions')),

    // Case 2: Check nested permissions
    esb.nestedQuery(
      esb.boolQuery().should([
        // User-level permission check
        esb.boolQuery().must([
          esb.termQuery('permissions.target.user.id', userId),
          esb.termsQuery('permissions.access_level', accessLevels),
        ]),

        // Group-level permission check
        esb.boolQuery().must([
          esb.termsQuery('permissions.target.group.id', groupsIds),
          esb.termsQuery('permissions.access_level', accessLevels),
        ]),
      ]),
      'permissions',
    ),
  ]).minimumShouldMatch(1);
}
