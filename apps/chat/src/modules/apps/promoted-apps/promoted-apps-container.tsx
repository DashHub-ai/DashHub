import { clsx } from 'clsx';
import { flow } from 'fp-ts/lib/function';
import { ArrowRight, HistoryIcon, StarIcon } from 'lucide-react';
import { Link } from 'wouter';

import { useLastNonNullValue } from '@llm/commons-front';
import {
  SdkSearchAppsInputV,
  useSdkForLoggedIn,
  useSdkOptimisticFavoritesCount,
} from '@llm/sdk';
import { useI18n } from '~/i18n';
import { LazyIcon } from '~/modules/shared';
import { useWorkspaceOrganizationOrThrow } from '~/modules/workspace';
import { useSitemap } from '~/routes';
import {
  CardSkeletonGrid,
  SelectableBadgeItem,
  SelectableBadges,
  SelectableBadgesSkeleton,
  useDebouncedPaginatedSearch,
} from '~/ui';

import { AppCard } from '../grid/app-card';
import { AppsPlaceholder } from '../grid/apps-placeholder';

type Props = {
  className?: string;
};

const RESET_NON_CATEGORIES_FILTERS = {
  sort: 'score:desc',
  recent: false,
  favorites: false,
} as const;

export function PromotedAppsContainer({ className }: Props) {
  const { assignWorkspaceToFilters } = useWorkspaceOrganizationOrThrow();
  const { sdks } = useSdkForLoggedIn();

  const sitemap = useSitemap();
  const t = useI18n().pack;

  const optimisticFavoritesCount = useSdkOptimisticFavoritesCount();
  const { loading, pagination, result, silentReload } = useDebouncedPaginatedSearch({
    storeDataInUrl: false,
    schema: SdkSearchAppsInputV,
    fallbackSearchParams: {
      limit: 3,
      includeRecentChats: true,
      sort: 'score:desc',
      ...optimisticFavoritesCount && {
        favorites: true,
        sort: 'favorites:desc',
      },
    },
    fetchResultsTask: flow(assignWorkspaceToFilters, sdks.dashboard.apps.search),
  });

  const { value, bind, setValue } = pagination;

  const gridClassName = clsx(
    'gap-4 grid grid-cols-1',
    'lg:grid-cols-3',
  );

  const categoriesTree = (useLastNonNullValue(result?.aggs?.categories) || []).map(category => ({
    ...category,
    icon: <LazyIcon name={category.icon as any} size={16} />,
  }));

  return (
    <div className={className}>
      <div className="mb-6">
        {loading || !categoriesTree
          ? (
              <SelectableBadgesSkeleton />
            )
          : (
              <SelectableBadges
                {...bind.path('categoriesIds', {
                  input: val => val ?? [],
                  relatedInputs: ({ newGlobalValue }) => ({
                    ...newGlobalValue,
                    ...RESET_NON_CATEGORIES_FILTERS,
                  }),
                })}
                items={categoriesTree}
                visibilityLimit={8}
                prefix={(
                  <>
                    <SelectableBadgeItem
                      icon={<StarIcon size={16} />}
                      name={t.appsCategories.sidebar.favoriteApps}
                      isSelected={!!value.favorites}
                      onClick={() => {
                        setValue({
                          value: {
                            ...value,
                            ...RESET_NON_CATEGORIES_FILTERS,
                            ...!value.favorites && {
                              sort: 'favorites:desc',
                              favorites: !value.favorites,
                              categoriesIds: [],
                            },
                          },
                        });
                      }}
                    />

                    <SelectableBadgeItem
                      icon={<HistoryIcon size={16} />}
                      name={t.appsCategories.sidebar.recentApps}
                      isSelected={!!value.recent}
                      onClick={() => {
                        setValue({
                          value: {
                            ...value,
                            ...RESET_NON_CATEGORIES_FILTERS,
                            ...!value.recent && {
                              sort: 'recently-used:desc',
                              recent: !value.recent,
                              categoriesIds: [],
                            },
                          },
                        });
                      }}
                    />
                  </>
                )}
              />
            )}
      </div>

      {loading && <CardSkeletonGrid className={gridClassName} count={3} />}

      {!loading && !result?.total && <AppsPlaceholder />}

      {!loading && !!result?.total && (
        <>
          <div className={gridClassName}>
            {result.items.map(item => (
              <AppCard
                key={item.id}
                app={item}
                onAfterArchive={silentReload}
                onAfterUnarchive={silentReload}
                onAfterToggleFavorite={silentReload}
              />
            ))}
          </div>

          <div className="flex justify-center mt-6">
            <Link
              href={sitemap.apps.index.generate({
                searchParams: {
                  ...value,
                  limit: undefined,
                  offset: undefined,
                },
              })}
              className="flex items-center gap-1 text-primary text-sm transition-colors"
            >
              {t.links.seeAll}
              <ArrowRight size={14} className="text-primary" />
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
