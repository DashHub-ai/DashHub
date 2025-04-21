import { v4 } from 'uuid';
import { useLocation } from 'wouter';

import { useI18n } from '~/i18n';
import {
  LayoutHeader,
  PageFormSection,
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

  const defaultValue = assignWorkspaceOrganization<Omit<CreateAIExternalAPIFormValue, 'organization'>>({
    name: '',
    description: '',
    permissions: [],
    logo: null,
    schema: {
      apiUrl: 'https://api.example.com',
      endpoints: [
        {
          id: v4(),
          method: 'GET',
          functionName: '',
          description: '',
          path: '',
          parameters: [
            {
              id: v4(),
              name: 'q',
              ai: {
                required: false,
                generated: true,
              },
              placement: 'query',
              type: 'string',
              description: '',
              value: null,
            },
          ],
        },
      ],
      parameters: [
        {
          id: v4(),
          name: 'Authorization',
          ai: {
            required: true,
            generated: false,
          },
          placement: 'header',
          type: 'string',
          description: '',
          value: null,
        },
      ],
    },
  });

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
