import { useLocation } from 'wouter';

import { useI18n } from '~/i18n';
import {
  LayoutHeader,
  PageWithSidebarLayout,
} from '~/layouts';
import {
  AIExternalAPICreateForm,
  type CreateAIExternalAPIFormValue,
  useWorkspaceOrganizationOrThrow,
} from '~/modules';
import { RouteMetaTags, useSitemap } from '~/routes';

export function CreateAIExternalAPIRoute() {
  const { pack } = useI18n();
  const t = pack.routes.createAIExternalAPI;

  const [, navigate] = useLocation();
  const sitemap = useSitemap();
  const { assignWorkspaceOrganization } = useWorkspaceOrganizationOrThrow();

  const defaultValue = assignWorkspaceOrganization<CreateAIExternalAPIFormValue>({
    name: '',
    description: '',
    permissions: [],
    logo: null,
    schema: {
      endpoints: [],
      parameters: [],
    },
  });

  const onAfterSubmit = () => {
    navigate(sitemap.aiExternalAPIs.index.generate({}));
  };

  return (
    <PageWithSidebarLayout>
      <RouteMetaTags meta={t.meta} />

      <section className="flex flex-col gap-6 mx-auto max-w-4xl">
        <LayoutHeader>
          {t.title}
        </LayoutHeader>

        <AIExternalAPICreateForm
          defaultValue={defaultValue}
          onAfterSubmit={onAfterSubmit}
        />
      </section>
    </PageWithSidebarLayout>
  );
}
