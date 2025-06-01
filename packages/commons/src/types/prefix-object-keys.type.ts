export type PrefixObjectKeys<P extends string, T> = {
  [K in keyof T as K extends string ? `${P}${K}` : never]: T[K];
};
