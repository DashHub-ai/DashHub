import { identity, pipe } from 'fp-ts/lib/function';

import type {
  SearchOrganizationsRouteUrlFiltersT,
  SearchUsersRouteUrlFiltersT,
} from '~/modules';

import {
  type InferStrictPathParams,
  parameterizeStrictPath,
  type SearchParamsMap,
  type StrictParametrizeParams,
  withHash,
  withSearchParams,
} from '@llm/commons';

export function useSitemap() {
  return {
    home: '/',
    login: '/login',
    organizations: {
      index: defineRouteGenerator<SearchOrganizationsRouteUrlFiltersT>()('/organizations'),
    },
    users: {
      index: defineRouteGenerator<SearchUsersRouteUrlFiltersT>()('/users'),
    },
    s3: {
      index: defineRouteGenerator()('/s3'),
    },
  };
};

function defineRouteGenerator<
  S extends SearchParamsMap = SearchParamsMap,
  const H extends string = never,
>(defaultSearchParams?: Partial<S>) {
  return <const P extends string>(schema: P) => ({
    raw: schema,
    generate: (attrs: GenerateRouteGeneratorAttrs<P, H, S>) => pipe(
      'pathParams' in attrs
        ? parameterizeStrictPath(schema, attrs.pathParams)
        : schema,

      'hash' in attrs
        ? withHash(attrs.hash)
        : identity,

      attrs.searchParams || defaultSearchParams
        ? withSearchParams(
          {
            ...defaultSearchParams,
            ...attrs.searchParams,
          },
        )
        : identity,
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
  }
  & (H extends never
    ? never
    : {
        hash?: H;
      }
  ) & (
    InferStrictPathParams<P> extends never
      ? never
      : {
          pathParams: StrictParametrizeParams<P>;
        }
  );
