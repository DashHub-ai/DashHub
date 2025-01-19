import { ContentCard } from '@llm/ui';
import { useI18n } from '~/i18n';
import { AIModelsTableContainer } from '~/modules/ai-models/table';

import { ManagementLayout } from '../layout';

export function AIModelsManagementRoute() {
  const t = useI18n().pack.routes.management.pages.aiModels;

  return (
    <ManagementLayout title={t.title}>
      <ContentCard title={t.title}>
        <AIModelsTableContainer />
      </ContentCard>
    </ManagementLayout>
  );
}
