export type CamelCaseToSnakeCase<S> = S extends `${infer T}${infer U}`
  ? `${T extends Capitalize<T>
    ? T extends '_'
      ? ''
      : '_'
    : ''}${Lowercase<T>}${CamelCaseToSnakeCase<U>}`
  : S;

export type CamelCaseToSnakeCaseObject<I> = I extends Date
  ? Date
  : I extends string
    ? I
    : I extends number
      ? I
      : I extends any[]
        ? Array<CamelCaseToSnakeCaseObject<I[number]>>
        : I extends Record<string, any>
          ? {
              [K in keyof I as CamelCaseToSnakeCase<K>]: CamelCaseToSnakeCaseObject<
                I[K]
              >;
            }
          : I;
