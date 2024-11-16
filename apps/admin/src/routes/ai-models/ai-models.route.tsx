import { useI18n } from '~/i18n';
import { LayoutHeader, PageWithNavigationLayout } from '~/layouts';
import { AIModelsTableContainer } from '~/modules/ai-models';

import { RouteMetaTags } from '../shared';

export function AIModelsRoute() {
  const t = useI18n().pack.routes.aiModels;

  return (
    <>
      <RouteMetaTags meta={t.meta} />
      <PageWithNavigationLayout>
        <LayoutHeader>
          {t.title}
        </LayoutHeader>

        <AIModelsTableContainer />
      </PageWithNavigationLayout>
    </>
  );
}
