import type { taskEither as TE } from 'fp-ts';

import type { SdkSearchEngineT } from '@llm/sdk';

import type { SearchEngineError } from '../search-engine.errors';

export abstract class SearchEngineProxy {
  constructor(
    protected readonly searchEngine: SdkSearchEngineT,
  ) {}

  protected get credentials() {
    return this.searchEngine.credentials;
  }

  abstract executeQuery(attrs: SearchEngineExecuteAttrs): TE.TaskEither<SearchEngineError, SearchEngineResultItem[]>;
}

export type SearchEngineExecuteAttrs = {
  query: string;
};

export type SearchEngineResultItem = {
  title: string;
  description: string;
  url: string;
};
