import {
  createIdObjectMapping,
  createNullableIdObjectMapping,
} from './id-object.mapping';

export function createIdNameObjectMapping(properties?: object) {
  return createIdObjectMapping({
    ...properties,
    name: { type: 'keyword' },
  });
}

export function createNullableIdNameObjectMapping(properties?: object) {
  return createNullableIdObjectMapping({
    ...properties,
    name: { type: 'keyword' },
  });
}
