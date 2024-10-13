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
        users: sdks.dashboard.users.search(defaultSearchFilters),
        organizations: sdks.dashboard.organizations.search(defaultSearchFilters),
        s3Buckets: sdks.dashboard.s3Buckets.search(defaultSearchFilters),
        projects: sdks.dashboard.projects.search(defaultSearchFilters),
        apps: sdks.dashboard.apps.search(defaultSearchFilters),
      }),
      tryOrThrowTE,
    ),
    [phrase],
  );
}
