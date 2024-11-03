import { identity, pipe } from 'fp-ts/lib/function';

import {
  type InferStrictPathParams,
  parameterizeStrictPath,
  type SearchParamsMap,
  type StrictParametrizeParams,
  withHash,
  withSearchParams,
} from '@llm/commons';

import { prefixWithBaseRoute } from './prefix-with-base-route';

export function defineSitemapRouteGenerator<
  S extends SearchParamsMap = SearchParamsMap,
  const H extends string = never,
>(defaultSearchParams?: Partial<S>) {
  return <const P extends string>(schema: P) => ({
    raw: prefixWithBaseRoute(schema),
    generate: ({ hash, pathParams, searchParams }: GenerateRouteGeneratorAttrs<P, H, S>) => pipe(
      pathParams
        ? parameterizeStrictPath(schema, pathParams)
        : schema,

      searchParams || defaultSearchParams
        ? withSearchParams(
          {
            ...defaultSearchParams,
            ...searchParams,
          },
        )
        : identity,

      hash
        ? withHash(hash)
        : identity,

      prefixWithBaseRoute,
    ),
  });
}

type GenerateRouteGeneratorAttrs<
  P extends string,
  H extends string = never,
  S extends SearchParamsMap = SearchParamsMap,
> =
  & {
    searchParams?: S;
    hash?: H;
  }
  & (
    InferStrictPathParams<P> extends never
      ? { pathParams?: undefined; }
      : { pathParams: StrictParametrizeParams<P>; }
  );
