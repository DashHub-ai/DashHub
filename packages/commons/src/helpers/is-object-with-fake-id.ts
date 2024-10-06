export const FAKE_OBJECT_ID = -1;

export function isObjectWithFakeID<T extends { id?: any; }>(obj: T): obj is T & { id: typeof FAKE_OBJECT_ID; } {
  return obj?.id === FAKE_OBJECT_ID;
}
