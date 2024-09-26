import { createMagicNullIdEsValue } from '../helpers';

export function createIdObjectMapping(properties?: object) {
  return {
    properties: {
      id: { type: 'integer' },
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
