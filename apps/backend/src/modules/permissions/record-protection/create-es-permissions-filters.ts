import esb from 'elastic-builder';

import { rejectFalsyItems } from '@llm/commons';

import type { UserAccessPermissionsDescriptor } from './permissions-row-protection-filters.types';

export function createEsPermissionsFilters(
  descriptor: UserAccessPermissionsDescriptor,
  permissionsFieldPath = 'permissions',
): esb.BoolQuery {
  return esb.boolQuery().filter([
    createNestedPermissionsEsFilters('inherited', descriptor, permissionsFieldPath),
    createNestedPermissionsEsFilters('current', descriptor, permissionsFieldPath),
  ]);
}

function createNestedPermissionsEsFilters(
  kind: 'current' | 'inherited',
  descriptor: UserAccessPermissionsDescriptor,
  permissionsFieldPath: string = 'permissions',
): esb.BoolQuery {
  const { userId, groupsIds, accessLevel } = descriptor;

  const isReadOnly = accessLevel === 'read';
  const accessLevels = isReadOnly
    ? ['read', 'write'] // if requesting read, allow both read and write
    : [accessLevel]; // if requesting write, only allow write

  return esb.boolQuery().filter([
    esb.boolQuery().should(rejectFalsyItems([
      // Case 1: Empty permissions array means public access, but only for read
      isReadOnly && esb.boolQuery().mustNot(
        esb.nestedQuery(esb.matchAllQuery(), `${permissionsFieldPath}.${kind}`),
      ),

      // Case 2: Check nested permissions
      esb.nestedQuery(
        esb.boolQuery().filter([
          esb.boolQuery().should([
            // User-level permission check
            esb.boolQuery().filter([
              esb.termQuery(`${permissionsFieldPath}.${kind}.target.user.id`, userId),
              esb.termsQuery(`${permissionsFieldPath}.${kind}.access_level`, accessLevels),
            ]),

            // Group-level permission check
            esb.boolQuery().filter([
              esb.termsQuery(`${permissionsFieldPath}.${kind}.target.group.id`, groupsIds),
              esb.termsQuery(`${permissionsFieldPath}.${kind}.access_level`, accessLevels),
            ]),
          ]).minimumShouldMatch(1),
        ]),
        `${permissionsFieldPath}.${kind}`,
      ),
    ])).minimumShouldMatch(1),
  ]);
}
