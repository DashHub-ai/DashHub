import { flow } from 'fp-ts/lib/function';
import { useMemo } from 'react';

import {
  SdkSearchProjectsInputV,
  useSdkForLoggedIn,
  useSdkSubscribePinnedMessagesOrThrow,
} from '@dashhub/sdk';
import { useWorkspaceOrganizationOrThrow } from '~/modules/workspace';
import {
  PaginatedList,
  PaginationSearchToolbarItem,
  PaginationToolbar,
  ResetFiltersButton,
  useDebouncedPaginatedSearch,
} from '~/ui';

import { PinnedMessagesPlaceholder } from './pinned-messages-placeholder';
import { PinnedMessagesTimeline } from './pinned-messages-timeline';

type Props = {
  storeDataInUrl?: boolean;
};

export function PinnedMessagesContainer({ storeDataInUrl = false }: Props) {
  const { assignWorkspaceToFilters } = useWorkspaceOrganizationOrThrow();

  const { sdks } = useSdkForLoggedIn();
  const { loading, pagination, result, reset } = useDebouncedPaginatedSearch({
    storeDataInUrl,
    schema: SdkSearchProjectsInputV,
    fallbackSearchParams: {
      limit: 100,
    },
    fetchResultsTask: flow(assignWorkspaceToFilters, sdks.dashboard.pinnedMessages.search),
  });

  const allPinnedItems = useSdkSubscribePinnedMessagesOrThrow();
  const mappedResult = useMemo(() => {
    if (!result || allPinnedItems.loading) {
      return null;
    }

    const mappedItems = result.items.filter(item => allPinnedItems.items.some(pinnedItem => pinnedItem.id === item.id));

    return {
      ...result,
      items: mappedItems,
      ...!mappedItems.length && {
        total: 0,
      },
    };
  }, [result, allPinnedItems]);

  return (
    <section>
      <PaginationToolbar
        className="mb-6"
        suffix={(
          <>
            <PaginationSearchToolbarItem
              {...pagination.bind.path('phrase', {
                relatedInputs: ({ newGlobalValue, newControlValue }) => ({
                  ...newGlobalValue,
                  sort: newControlValue ? 'score:desc' : 'createdAt:asc',
                }),
              })}
            />

            <ResetFiltersButton onClick={reset} />
          </>
        )}
      />

      <PaginatedList
        result={mappedResult}
        loading={loading || allPinnedItems.loading}
        pagination={pagination.bind.entire()}
        withEmptyPlaceholder={false}
      >
        {({ items, total }) => {
          if (!total || allPinnedItems.loading) {
            return <PinnedMessagesPlaceholder />;
          }

          return <PinnedMessagesTimeline items={items} />;
        }}
      </PaginatedList>
    </section>
  );
}
