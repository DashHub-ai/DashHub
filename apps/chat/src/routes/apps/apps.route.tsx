import { WandSparklesIcon } from 'lucide-react';
import { Link } from 'wouter';

import { useSdkForLoggedIn } from '@llm/sdk';
import { useI18n } from '~/i18n';
import { LayoutHeader, PageWithSidebarLayout } from '~/layouts';
import { AppsContainer, StartChatForm } from '~/modules';
import { RouteMetaTags, useSitemap } from '~/routes';

import { AppsTutorial } from './apps-tutorial';

export function AppsRoute() {
  const t = useI18n().pack.routes.apps;
  const sitemap = useSitemap();
  const { guard } = useSdkForLoggedIn();

  return (
    <PageWithSidebarLayout>
      <RouteMetaTags meta={t.meta} />

      <LayoutHeader root>
        {t.title}
      </LayoutHeader>

      <AppsTutorial />

      <div className="flex flex-col gap-16">
        <AppsContainer
          storeDataInUrl
          {...guard.is.minimum.techUser && {
            toolbar: (
              <Link
                href={sitemap.apps.create.generate({})}
                className="uk-button uk-button-primary uk-button-small"
              >
                <WandSparklesIcon className="mr-2" size={16} />
                {t.buttons.create}
              </Link>
            ),
          }}
          contentFooter={(
            <>
              <hr className="mx-auto my-14 w-1/4" />

              <section className="mx-auto px-4 max-w-3xl container">
                <h2 className="mb-6 font-semibold text-2xl text-center">
                  {t.startChat.title}
                </h2>
                <StartChatForm />
              </section>
            </>
          )}
        />
      </div>
    </PageWithSidebarLayout>
  );
}
