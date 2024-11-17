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

type Props = {
  storeDataInUrl?: boolean;
};

export function ChatsContainer({ storeDataInUrl = false }: Props) {
  const { organization } = useWorkspaceOrganizationOrThrow();

  const { sdks } = useSdkForLoggedIn();
  const { loading, pagination, result } = useDebouncedPaginatedSearch({
    storeDataInUrl,
    schema: SdKSearchChatsInputV,
    fallbackSearchParams: {},
    fetchResultsTask: filters => sdks.dashboard.chats.search({
      ...filters,
      organizationIds: [organization.id],
    }),
  });

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
            <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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
