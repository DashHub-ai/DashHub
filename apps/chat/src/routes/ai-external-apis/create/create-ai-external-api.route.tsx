import { useLocation } from 'wouter';

import { useI18n } from '~/i18n';
import {
  LayoutHeader,
  PageFormSection,
  PageWithSidebarLayout,
} from '~/layouts';
import {
  AIExternalAPICreateForm,
  useAIExternalAPIDefaultValue,
} from '~/modules';
import { RouteMetaTags, useSitemap } from '~/routes';

export function CreateAIExternalAPIRoute() {
  const { pack } = useI18n();
  const t = pack.routes.createAIExternalAPI;

  const [, navigate] = useLocation();
  const sitemap = useSitemap();
  const defaultValue = useAIExternalAPIDefaultValue();

  const onAfterSubmit = () => {
    navigate(sitemap.aiExternalAPIs.index.generate({}));
  };

  return (
    <PageWithSidebarLayout>
      <RouteMetaTags meta={t.meta} />

      <PageFormSection>
        <LayoutHeader>
          {t.title}
        </LayoutHeader>

        <AIExternalAPICreateForm
          defaultValue={defaultValue}
          onAfterSubmit={onAfterSubmit}
        />
      </PageFormSection>
    </PageWithSidebarLayout>
  );
}
