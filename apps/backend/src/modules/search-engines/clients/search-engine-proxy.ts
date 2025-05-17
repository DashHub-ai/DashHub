import type { taskEither as TE } from 'fp-ts';

import type { SdkSearchEngineT } from '@dashhub/sdk';

import type { SearchEngineProxyError } from './search-engine-proxy.error';

export abstract class SearchEngineProxy {
  constructor(
    protected readonly searchEngine: SdkSearchEngineT,
  ) {}

  protected get credentials() {
    return this.searchEngine.credentials;
  }

  abstract executeQuery(attrs: SearchEngineExecuteAttrs): TE.TaskEither<SearchEngineProxyError, SearchEngineResultItem[]>;
}

export type SearchEngineExecuteAttrs = {
  query: string;
  language: string;
  results: number;
};

export type SearchEngineResultItem = {
  title: string;
  description: string;
  url: string;
};
