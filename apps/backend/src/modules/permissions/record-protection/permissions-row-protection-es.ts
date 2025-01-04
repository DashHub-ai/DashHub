import { createIdObjectMapping } from '~/modules/elasticsearch/mappings/id-object.mapping';

export function createPermissionsRowEntryMapping() {
  return {
    type: 'nested',
    ...createIdObjectMapping({
      group_id: { type: 'integer' },
      user_id: { type: 'integer' },
      access_level: { type: 'keyword' },
    }),
  };
}
