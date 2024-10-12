import { parameterizePath } from './parameterize-path';

export function parameterizeStrictPath<const P extends string>(
  path: P,
  params: StrictParametrizeParams<P>,
) {
  return parameterizePath(params)(path);
}

export type StrictParametrizeParams<T extends string> = Record<
  InferStrictPathParams<T>,
  string | number | boolean
>;

export type InferStrictPathParams<T extends string> =
  T extends `${infer _}:${infer P}/${infer R}`
    ? P | InferStrictPathParams<R>
    : T extends `${infer _}:${infer P}`
      ? P
      : never;
