import clsx from 'clsx';

import {
  type SdkSearchChatsInputT,
  SdkSearchChatsInputV,
  type SdkTableRowWithIdT,
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

const GRID_COLUMNS_CLASSES = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
} as const;

type Props = {
  project?: SdkTableRowWithIdT;
  columns?: keyof typeof GRID_COLUMNS_CLASSES;
  filters?: Partial<SdkSearchChatsInputT>;
};

export function ChatsContainer({ filters: forwardedFilters, project, columns = 2 }: Props) {
  const { organization } = useWorkspaceOrganizationOrThrow();

  const { sdks } = useSdkForLoggedIn();
  const { loading, pagination, result, silentReload } = useDebouncedPaginatedSearch({
    storeDataInUrl: false,
    schema: SdkSearchChatsInputV,
    fallbackSearchParams: {
      limit: 12,
    },
    fetchResultsTask: filters => sdks.dashboard.chats.search({
      ...forwardedFilters,
      ...filters,
      organizationIds: [organization.id],
      ...project && {
        projectsIds: [project.id],
      },
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
            <div className={clsx('gap-4 grid grid-cols-1', GRID_COLUMNS_CLASSES[columns])}>
              {items.map(item => (
                <ChatCard
                  key={item.id}
                  chat={item}
                  withProject={!project}
                />
              ))}
            </div>
          );
        }}
      </PaginatedList>
    </section>
  );
}
