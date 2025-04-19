import { useI18n } from '~/i18n';
import {
  LayoutHeader,
  PageFormSection,
  PageWithSidebarLayout,
} from '~/layouts';
import {
  AppCreateForm,
  useCreateChatWithInitialApp,
  useWorkspaceOrganizationOrThrow,
} from '~/modules';
import { RouteMetaTags } from '~/routes';
import { createFakeSelectItem } from '~/ui';

export function CreateAppRoute() {
  const { pack } = useI18n();
  const t = pack.routes.createApp;

  const { assignWorkspaceOrganization } = useWorkspaceOrganizationOrThrow();
  const [createChatWithApp] = useCreateChatWithInitialApp();

  const defaultValue = assignWorkspaceOrganization({
    name: '',
    chatContext: '',
    description: '',
    permissions: [],
    category: createFakeSelectItem(),
    aiModel: null,
    promotion: 0,
  });

  return (
    <PageWithSidebarLayout>
      <RouteMetaTags meta={t.meta} />

      <PageFormSection>
        <LayoutHeader>
          {t.title}
        </LayoutHeader>

        <AppCreateForm
          defaultValue={defaultValue}
          onAfterSubmit={(app) => {
            void createChatWithApp(app);
          }}
        />
      </PageFormSection>
    </PageWithSidebarLayout>
  );
}
