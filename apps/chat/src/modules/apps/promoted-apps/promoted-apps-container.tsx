import { clsx } from 'clsx';
import { flow } from 'fp-ts/lib/function';
import { ArrowRight } from 'lucide-react';
import { Link } from 'wouter';

import { useLastNonNullValue } from '@llm/commons-front';
import {
  type SdkAppT,
  SdkSearchAppsInputV,
  useSdkForLoggedIn,
} from '@llm/sdk';
import { useI18n } from '~/i18n';
import { LazyIcon } from '~/modules/shared';
import { useWorkspaceOrganizationOrThrow } from '~/modules/workspace';
import { useSitemap } from '~/routes';
import {
  CardSkeletonGrid,
  PaginatedList,
  SelectableBadges,
  SelectableBadgesSkeleton,
  useDebouncedPaginatedSearch,
} from '~/ui';

import { AppCard } from '../grid/app-card';
import { AppsPlaceholder } from '../grid/apps-placeholder';

type Props = {
  title?: string;
  limit?: number;
  className?: string;
};

export function PromotedAppsContainer({ title, limit = 3, className }: Props) {
  const { assignWorkspaceToFilters } = useWorkspaceOrganizationOrThrow();
  const { sdks } = useSdkForLoggedIn();

  const sitemap = useSitemap();
  const t = useI18n().pack;

  const { loading, pagination, result, silentReload } = useDebouncedPaginatedSearch({
    storeDataInUrl: false,
    schema: SdkSearchAppsInputV,
    fallbackSearchParams: {
      limit,
    },
    fetchResultsTask: flow(assignWorkspaceToFilters, sdks.dashboard.apps.search),
  });

  const gridClassName = clsx(
    'gap-4 grid grid-cols-1',
    'lg:grid-cols-2 3xl:grid-cols-3',
  );

  const categoriesTree = (useLastNonNullValue(result?.aggs?.categories) || []).map(category => ({
    ...category,
    icon: <LazyIcon name={category.icon as any} size={16} />,
  }));

  return (
    <div className={className}>
      {title && (
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-semibold text-xl">
            {title}
          </h2>

          <Link href={sitemap.apps.index.generate({})} className="flex items-center gap-1 text-primary hover:underline">
            {t.links.seeAll}
            <ArrowRight size={16} className="text-primary" />
          </Link>
        </div>
      )}

      <div className="mb-6">
        {loading || !categoriesTree
          ? (
              <SelectableBadgesSkeleton />
            )
          : (
              <SelectableBadges
                {...pagination.bind.path('categoriesIds', { input: val => val ?? [] })}
                items={categoriesTree}
                multiSelect
                visibilityLimit={5}
              />
            )}
      </div>

      <PaginatedList
        result={result}
        loading={loading}
        pagination={pagination.bind.entire()}
        withEmptyPlaceholder={false}
        loadingFallback={(
          <CardSkeletonGrid className={gridClassName} count={limit} />
        )}
      >
        {({ items, total }) => {
          if (!total) {
            return <AppsPlaceholder />;
          }

          return (
            <div className={gridClassName}>
              {(items as SdkAppT[]).map(item => (
                <AppCard
                  key={item.id}
                  app={item}
                  onAfterArchive={silentReload}
                  onAfterUnarchive={silentReload}
                  onAfterToggleFavorite={silentReload}
                />
              ))}
            </div>
          );
        }}
      </PaginatedList>
    </div>
  );
}
