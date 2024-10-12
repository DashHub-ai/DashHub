import { identity, pipe } from 'fp-ts/lib/function';

import type { SdkTableRowIdT } from '@llm/sdk';
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
  const sitemap = {
    home: '/',
    login: '/login',
    organizations: {
      index: defineRouteGenerator<SearchOrganizationsRouteUrlFiltersT>()('/organizations'),
      show: (id: SdkTableRowIdT) => sitemap.organizations.index.generate({
        searchParams: {
          archived: null,
          ids: [id],
        },
      }),
    },
    apps: {
      index: defineRouteGenerator()('/apps'),
    },
    projects: {
      index: defineRouteGenerator<SearchUsersRouteUrlFiltersT>()('/projects'),
    },
    users: {
      index: defineRouteGenerator<SearchUsersRouteUrlFiltersT>()('/users'),
    },
    s3: {
      index: defineRouteGenerator()('/s3'),
    },
  };

  return sitemap;
};

function defineRouteGenerator<
  S extends SearchParamsMap = SearchParamsMap,
  const H extends string = never,
>(defaultSearchParams?: Partial<S>) {
  return <const P extends string>(schema: P) => ({
    raw: schema,
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
