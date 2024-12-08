import { WandSparklesIcon } from 'lucide-react';

import { useI18n } from '~/i18n';
import { LayoutHeader, PageWithNavigationLayout } from '~/layouts';
import { AppsContainer } from '~/modules';
import { RouteMetaTags } from '~/routes/shared';

import { AppsTutorial } from './apps-tutorial';

export function AppsRoute() {
  const t = useI18n().pack.routes.apps;

  return (
    <PageWithNavigationLayout>
      <RouteMetaTags meta={t.meta} />

      <LayoutHeader>
        {t.title}
      </LayoutHeader>

      <AppsTutorial />

      <AppsContainer
        toolbar={(
          <button
            type="button"
            className="uk-button uk-button-primary uk-button-small"
          >
            <WandSparklesIcon className="mr-2" size={16} />
            {t.buttons.create}
          </button>
        )}
      />
    </PageWithNavigationLayout>
  );
}
