import {
  SdKSearchChatsInputV,
  useSdkForLoggedIn,
} from '@llm/sdk';
import {
  ArchiveFilterTabs,
  PaginatedList,
  PaginationSearchToolbarItem,
  PaginationToolbar,
  useDebouncedPaginatedSearch,
} from '@llm/ui';
import { useWorkspaceOrganizationOrThrow } from '~/modules/workspace';

import { ChatCard } from './chat-card';
import { ChatHistoryPlaceholder } from './chat-history-placeholder';
import { useReloadIntervalIfGenerating } from './use-reload-interval-if-generating';

type Props = {
  storeDataInUrl?: boolean;
};

export function ChatsContainer({ storeDataInUrl = false }: Props) {
  const { organization } = useWorkspaceOrganizationOrThrow();

  const { sdks } = useSdkForLoggedIn();
  const { loading, pagination, result, silentReload } = useDebouncedPaginatedSearch({
    storeDataInUrl,
    schema: SdKSearchChatsInputV,
    fallbackSearchParams: {
      limit: 12,
    },
    fetchResultsTask: filters => sdks.dashboard.chats.search({
      ...filters,
      organizationIds: [organization.id],
    }),
  });

  useReloadIntervalIfGenerating(silentReload, result);

  return (
    <section>
      <PaginationToolbar
        className="mb-6"
        suffix={(
          <ArchiveFilterTabs {...pagination.bind.path('archived')} />
        )}
      >
        <PaginationSearchToolbarItem
          {...pagination.bind.path('phrase', {
            relatedInputs: ({ newGlobalValue, newControlValue }) => ({
              ...newGlobalValue,
              sort: newControlValue ? 'score:desc' : 'createdAt:asc',
            }),
          })}
        />
      </PaginationToolbar>

      <PaginatedList
        result={result}
        loading={loading}
        pagination={pagination.bind.entire()}
        withEmptyPlaceholder={false}
      >
        {({ items, total }) => {
          if (!total) {
            return <ChatHistoryPlaceholder />;
          }

          return (
            <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
              {items.map(item => (
                <ChatCard
                  key={item.id}
                  chat={item}
                />
              ))}
            </div>
          );
        }}
      </PaginatedList>
    </section>
  );
}
