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
import { RouteMetaTags } from '~/routes';
import { createFakeSelectItem } from '~/ui';

export function CreateAppRoute() {
  const t = useI18n().pack.routes.createApp;
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

      <LayoutBreadcrumbs currentBreadcrumb={t.title} />

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
