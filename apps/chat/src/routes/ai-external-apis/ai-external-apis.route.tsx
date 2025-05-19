import { WandSparklesIcon } from 'lucide-react';
import { Link } from 'wouter';

import { useSdkForLoggedIn } from '@dashhub/sdk';
import { useI18n } from '~/i18n';
import { LayoutHeader, PageWithSidebarLayout } from '~/layouts';
import { AIExternalAPIsContainer } from '~/modules/ai-external-apis';
import { RouteMetaTags, useSitemap } from '~/routes';

export function AIExternalAPIsRoute() {
  const t = useI18n().pack.routes.aiExternalAPIs;
  const sitemap = useSitemap();
  const { guard } = useSdkForLoggedIn();

  return (
    <PageWithSidebarLayout>
      <RouteMetaTags meta={t.meta} />

      <LayoutHeader>
        {t.title}
      </LayoutHeader>

      <div className="flex flex-col gap-16">
        <AIExternalAPIsContainer
          storeDataInUrl
          {...guard.is.minimum.techUser && {
            toolbar: (
              <Link
                href={sitemap.aiExternalAPIs.create.generate({})}
                className="uk-button uk-button-primary uk-button-small"
              >
                <WandSparklesIcon className="mr-2" size={16} />
                {t.buttons.create}
              </Link>
            ),
          }}
        />
      </div>
    </PageWithSidebarLayout>
  );
}
