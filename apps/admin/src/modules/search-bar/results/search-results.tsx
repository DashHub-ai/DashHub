import { useDebounceValue } from '@llm/commons-front';
import { NoItemsPlaceholder, SpinnerContainer, UkIcon } from '@llm/ui';
import { useI18n } from '~/i18n';
import { useSitemap } from '~/routes';

import { SearchResultGroup } from './search-result-group';
import { useSearchResult } from './use-search-result';

type Props = {
  phrase: string;
};

export function SearchResults({ phrase }: Props) {
  const t = useI18n().pack.modules.searchBar;
  const sitemap = useSitemap();
  const debouncedPhrase = useDebounceValue(
    {
      delay: 100,
    },
    phrase,
  );

  const searchResult = useSearchResult(debouncedPhrase.value);

  if (debouncedPhrase.loading || searchResult.status !== 'success') {
    return <SpinnerContainer scale={0.8} />;
  }

  const totalItems = Object.values(searchResult.data).reduce(
    (acc, { total }) => acc + total,
    0,
  );

  if (!totalItems) {
    return (
      <div className="px-4 py-3 space-y-2">
        <NoItemsPlaceholder />
      </div>
    );
  }

  const {
    users,
    apps,
    organizations,
    projects,
    s3Buckets,
  } = searchResult.data;

  return (
    <>
      {users.total > 0 && (
        <SearchResultGroup
          icon={<UkIcon icon="user" />}
          groupProps={{
            header: t.groups.users.header,
            viewAllHref: sitemap.users.index.generate({
              searchParams: {
                phrase: debouncedPhrase.value,
                sort: 'score:desc',
              },
            }),
          }}
          result={{
            total: users.total,
            items: users.items.map(({ id, email }) => ({
              id,
              name: email,
              subTitle: t.groups.users.itemSubTitle,
              href: sitemap.users.index.generate({
                searchParams: {
                  ids: [id],
                },
              }),
            })),
          }}
        />
      )}

      {organizations.total > 0 && (
        <SearchResultGroup
          icon={<UkIcon icon="building" />}
          groupProps={{
            header: t.groups.organizations.header,
            viewAllHref: sitemap.organizations.index.generate({
              searchParams: {
                phrase: debouncedPhrase.value,
                sort: 'score:desc',
              },
            }),
          }}
          result={{
            total: organizations.total,
            items: organizations.items.map(({ id, name }) => ({
              id,
              name,
              subTitle: t.groups.organizations.itemSubTitle,
              href: sitemap.organizations.index.generate({
                searchParams: {
                  ids: [id],
                },
              }),
            })),
          }}
        />
      )}

      {s3Buckets.total > 0 && (
        <SearchResultGroup
          icon={<UkIcon icon="cloud" />}
          groupProps={{
            header: t.groups.s3Buckets.header,
            viewAllHref: sitemap.s3Buckets.index.generate({
              searchParams: {
                phrase: debouncedPhrase.value,
                sort: 'score:desc',
              },
            }),
          }}
          result={{
            total: s3Buckets.total,
            items: s3Buckets.items.map(({ id, name }) => ({
              id,
              name,
              subTitle: t.groups.s3Buckets.itemSubTitle,
              href: sitemap.s3Buckets.index.generate({
                searchParams: {
                  ids: [id],
                },
              }),
            })),
          }}
        />
      )}

      {projects.total > 0 && (
        <SearchResultGroup
          icon={<UkIcon icon="folder" />}
          groupProps={{
            header: t.groups.projects.header,
            viewAllHref: sitemap.projects.index.generate({
              searchParams: {
                phrase: debouncedPhrase.value,
                sort: 'score:desc',
              },
            }),
          }}
          result={{
            total: projects.total,
            items: projects.items.map(({ id, name }) => ({
              id,
              name,
              subTitle: t.groups.projects.itemSubTitle,
              href: sitemap.projects.index.generate({
                searchParams: {
                  ids: [id],
                },
              }),
            })),
          }}
        />
      )}

      {apps.total > 0 && (
        <SearchResultGroup
          icon={<UkIcon icon="bot" />}
          groupProps={{
            header: t.groups.apps.header,
            viewAllHref: sitemap.apps.index.generate({
              searchParams: {
                phrase: debouncedPhrase.value,
                sort: 'score:desc',
              },
            }),
          }}
          result={{
            total: apps.total,
            items: apps.items.map(({ id, name }) => ({
              id,
              name,
              subTitle: t.groups.apps.itemSubTitle,
              href: sitemap.apps.index.generate({
                searchParams: {
                  ids: [id],
                },
              }),
            })),
          }}
        />
      )}
    </>
  );
}
