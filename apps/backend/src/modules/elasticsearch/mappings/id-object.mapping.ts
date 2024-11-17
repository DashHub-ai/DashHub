import { createMagicNullIdEsValue } from '../helpers';

export function createIdObjectMapping(properties?: object, idType = 'integer') {
  return {
    properties: {
      id: { type: idType },
      ...properties,
    },
  };
}

export function createNullableIdObjectMapping(properties?: object) {
  return {
    properties: {
      id: { type: 'integer', null_value: createMagicNullIdEsValue() },
      ...properties,
    },
  };
}
