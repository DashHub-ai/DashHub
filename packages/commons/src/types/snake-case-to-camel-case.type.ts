export type SnakeToCamelCase<S> = S extends `${infer T}_${infer U}`
  ? `${T}${Capitalize<SnakeToCamelCase<U>>}`
  : S;

export type SnakeCaseToCamelCaseObject<I> = I extends Date
  ? Date
  : I extends object[]
    ? Array<SnakeCaseToCamelCaseObject<I[number]>>
    : I extends Record<string, any>
      ? {
          [K in keyof I as SnakeToCamelCase<K>]: SnakeCaseToCamelCaseObject<I[K]>;
        }
      : I;
