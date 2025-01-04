import { createIdObjectMapping } from '~/modules/elasticsearch/mappings/id-object.mapping';

export function createPermissionsRowEntryMapping() {
  return {
    type: 'nested',
    properties: {
      access_level: { type: 'keyword' },
      target: {
        properties: {
          user: createIdObjectMapping(),
          group: createIdObjectMapping(),
        },
      },
    },
  };
}
