export type FalsyValues = false | undefined | null;

export type FalsyItem<O> = O | FalsyValues;

export function rejectFalsyItems<O>(items: Array<FalsyItem<O>>) {
  return items.filter(Boolean) as Array<Exclude<O, FalsyValues>>;
}
