/**
 * Appends a timestamp suffix to an index name.
 *
 * @param name - The index name.
 * @returns The index name with a timestamp suffix.
 */
export function appendTimestampToIndexName(name: string) {
  return `${name}-${genTimestampSuffix()}`;
}

/**
 * Generates a timestamp suffix.
 *
 * @returns The timestamp suffix.
 */
function genTimestampSuffix() {
  const date = new Date();
  const time = [
    date.getMonth(),
    date.getDay(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
  ].map(num => num.toString().padStart(2, '0'));

  return [
    date.getFullYear(),
    ...time,
    date.getMilliseconds().toString().padStart(3, '0'),
  ].join('');
}
