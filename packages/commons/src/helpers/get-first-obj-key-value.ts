/**
 * Get the first key value of an object.
 *
 * @param obj - The object to get the first key value from.
 * @returns The first key value of the object.
 */
export function getFirstObjKeyValue<O extends Record<string, any>>(obj: O) {
  const [key] = Object.keys(obj);

  return obj[key];
}
