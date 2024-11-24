export function without<O>(excludeItems: O[]) {
  return (array: O[]): O[] =>
    array.filter(item => !excludeItems.includes(item));
}
