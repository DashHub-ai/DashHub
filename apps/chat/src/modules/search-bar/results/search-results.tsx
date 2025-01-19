import { BotIcon, FolderIcon, MessageSquareTextIcon } from 'lucide-react';

import { useDebounceValue } from '@llm/commons-front';
import { NoItemsPlaceholder, SpinnerContainer } from '@llm/ui';
import { useI18n } from '~/i18n';
import { useSitemap } from '~/routes';

import { SearchResultGroup } from './search-result-group';
import { useSearchResult } from './use-search-result';

type Props = {
  phrase: string;
};

export function SearchResults({ phrase }: Props) {
  const { pack } = useI18n();
  const t = pack.searchBar;

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
      <div className="space-y-2 px-4 py-3">
        <NoItemsPlaceholder />
      </div>
    );
  }

  const {
    apps,
    projects,
    chats,
  } = searchResult.data;

  return (
    <>
      {chats.total > 0 && (
        <SearchResultGroup
          icon={<MessageSquareTextIcon size={16} />}
          groupProps={{
            header: t.groups.chats.header,
          }}
          result={{
            total: chats.total,
            items: chats.items.map(({ id, summary }) => ({
              id,
              name: summary.name.value || pack.chat.card.noTitle,
              subTitle: t.groups.chats.itemSubTitle,
              href: sitemap.chat.generate({
                pathParams: { id },
              }),
            })),
          }}
        />
      )}
      {projects.total > 0 && (
        <SearchResultGroup
          icon={<FolderIcon size={16} />}
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
          icon={<BotIcon size={16} />}
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
