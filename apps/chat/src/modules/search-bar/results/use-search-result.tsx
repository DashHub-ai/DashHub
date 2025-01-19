import { apply, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';

import { tryOrThrowTE } from '@llm/commons';
import { useAsyncValue } from '@llm/commons-front';
import { useSdkForLoggedIn } from '@llm/sdk';

export function useSearchResult(phrase: string) {
  const { sdks } = useSdkForLoggedIn();
  const defaultSearchFilters = {
    offset: 0,
    limit: 3,
    sort: 'score:desc',
    phrase,
    archived: false,
  } as const;

  return useAsyncValue(
    pipe(
      apply.sequenceS(TE.ApplicativePar)({
        projects: sdks.dashboard.projects.search(defaultSearchFilters),
        apps: sdks.dashboard.apps.search(defaultSearchFilters),
        chats: sdks.dashboard.chats.search(defaultSearchFilters),
      }),
      tryOrThrowTE,
    ),
    [phrase],
  );
}
