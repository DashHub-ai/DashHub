import type { ReactNode } from 'react';

import clsx from 'clsx';

import {
  type SdkSearchChatItemT,
  type SdkSearchChatsInputT,
  SdkSearchChatsInputV,
  type SdkTableRowWithIdT,
  useSdkForLoggedIn,
} from '@dashhub/sdk';
import { useWorkspaceOrganizationOrThrow } from '~/modules/workspace';
import {
  ArchiveFilterTabs,
  CardSkeletonGrid,
  PaginatedList,
  PaginationSearchToolbarItem,
  PaginationToolbar,
  type PaginationToolbarProps,
  useDebouncedPaginatedSearch,
} from '~/ui';

import { ChatCard, type ChatCardProps } from './chat-card';
import { ChatHistoryPlaceholder } from './chat-history-placeholder';
import { useReloadIntervalIfGenerating } from './use-reload-interval-if-generating';

const GRID_COLUMNS_CLASSES = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
} as const;

type Props = {
  limit?: number;
  project?: SdkTableRowWithIdT;
  columns?: keyof typeof GRID_COLUMNS_CLASSES;
  filters?: Partial<SdkSearchChatsInputT>;
  withAutoRefresh?: boolean;
  placeholder?: ReactNode;
  itemPropsFn?: (item: SdkSearchChatItemT) => Partial<ChatCardProps>;
  paginationToolbarProps?: Pick<PaginationToolbarProps, 'suffix'>;
};

export function ChatsContainer(
  {
    limit,
    filters: forwardedFilters,
    project,
    columns = 2,
    itemPropsFn,
    withAutoRefresh = true,
    placeholder,
    paginationToolbarProps,
  }: Props,
) {
  const { organization } = useWorkspaceOrganizationOrThrow();

  const { sdks } = useSdkForLoggedIn();
  const { loading, pagination, result, silentReload } = useDebouncedPaginatedSearch({
    storeDataInUrl: false,
    schema: SdkSearchChatsInputV,
    fallbackSearchParams: {
      limit: limit ?? 12,
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

  useReloadIntervalIfGenerating(silentReload, result, !withAutoRefresh);

  const gridClassName = clsx('gap-4 grid grid-cols-1', GRID_COLUMNS_CLASSES[columns]);

  return (
    <section>
      <PaginationToolbar
        className="mb-6"
        suffix={(
          <ArchiveFilterTabs {...pagination.bind.path('archived')} />
        )}
        {...paginationToolbarProps}
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
        loadingFallback={(
          <CardSkeletonGrid className={gridClassName} count={pagination.value.limit} />
        )}
      >
        {({ items, total }) => {
          if (!total) {
            return placeholder ?? <ChatHistoryPlaceholder />;
          }

          return (
            <div className={gridClassName}>
              {items.map(item => (
                <ChatCard
                  key={item.id}
                  chat={item}
                  withProject={!project}
                  onAfterToggleFavorite={silentReload}
                  {...itemPropsFn?.(item)}
                />
              ))}
            </div>
          );
        }}
      </PaginatedList>
    </section>
  );
}
