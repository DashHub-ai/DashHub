import { Link } from 'wouter';

import { useI18n } from '~/i18n';
import {
  LayoutBreadcrumbs,
  LayoutHeader,
  PageWithNavigationLayout,
} from '~/layouts';
import {
  AppCreateForm,
  useCreateChatWithInitialApp,
  useWorkspaceOrganizationOrThrow,
} from '~/modules';
import { RouteMetaTags, useSitemap } from '~/routes';
import { createFakeSelectItem } from '~/ui';

export function CreateAppRoute() {
  const { pack } = useI18n();
  const t = pack.routes.createApp;

  const sitemap = useSitemap();
  const { assignWorkspaceOrganization } = useWorkspaceOrganizationOrThrow();
  const [createChatWithApp] = useCreateChatWithInitialApp();

  const defaultValue = assignWorkspaceOrganization({
    name: '',
    chatContext: '',
    description: '',
    permissions: [],
    category: createFakeSelectItem(),
  });

  return (
    <PageWithNavigationLayout>
      <RouteMetaTags meta={t.meta} />

      <LayoutBreadcrumbs
        currentBreadcrumb={t.title}
        breadcrumbs={(
          <li>
            <Link href={sitemap.apps.index.generate({})}>
              {pack.breadcrumbs.routes.apps}
            </Link>
          </li>
        )}
      />

      <section className="flex flex-col gap-6 mx-auto max-w-4xl">
        <LayoutHeader withBreadcrumbs={false}>
          {t.title}
        </LayoutHeader>

        <AppCreateForm
          defaultValue={defaultValue}
          onAfterSubmit={(app) => {
            void createChatWithApp(app);
          }}
        />
      </section>
    </PageWithNavigationLayout>
  );
}
