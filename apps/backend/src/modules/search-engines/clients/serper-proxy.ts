import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/function';

import type { SearchEngineExecuteAttrs, SearchEngineResultItem } from './search-engine-proxy';

import { SearchEngineProxy } from './search-engine-proxy';
import { SearchEngineProxyError } from './search-engine-proxy.error';

export class SerperProxy extends SearchEngineProxy {
  private readonly API_URL = 'https://google.serper.dev/search';

  executeQuery(
    {
      query,
      language,
      results,
    }: SearchEngineExecuteAttrs,
  ): TE.TaskEither<SearchEngineProxyError, SearchEngineResultItem[]> {
    return pipe(
      TE.tryCatch(
        async () => {
          const response = await fetch(this.API_URL, {
            method: 'POST',
            headers: {
              'X-API-KEY': this.credentials.apiKey,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              q: query,
              hl: language,
              results,
            }),
          });

          if (!response.ok) {
            throw new Error(`Serper API error: ${response.statusText}`);
          }

          const data = await response.json();

          return data.organic.map((result: any) => ({
            title: result.title,
            description: result.snippet,
            url: result.link,
          }));
        },
        error => new SearchEngineProxyError(`Failed to execute Serper search: ${error}`),
      ),
    );
  }
}
