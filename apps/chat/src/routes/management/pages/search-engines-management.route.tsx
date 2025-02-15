import { useI18n } from '~/i18n';
import { SearchEnginesTableContainer } from '~/modules/search-engines';
import { ContentCard } from '~/ui';

import { ManagementLayout } from '../layout';

export function SearchEnginesManagementRoute() {
  const t = useI18n().pack.routes.management.pages.searchEngines;

  return (
    <ManagementLayout title={t.title}>
      <ContentCard title={t.title}>
        <SearchEnginesTableContainer />
      </ContentCard>
    </ManagementLayout>
  );
}
