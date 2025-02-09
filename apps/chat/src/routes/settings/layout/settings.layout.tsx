import type { PropsWithChildren } from 'react';

import { UserCircleIcon } from 'lucide-react';

import { useI18n } from '~/i18n';
import { LayoutHeader, PageWithNavigationLayout } from '~/layouts';
import { RouteMetaTags, useSitemap } from '~/routes';
import { SideLayout, SideNav, SideNavItem } from '~/ui';

type Props = PropsWithChildren & {
  title: string;
};

export function SettingsLayout({ title, children }: Props) {
  const t = useI18n().pack.routes.settings;
  const sitemap = useSitemap();

  return (
    <PageWithNavigationLayout>
      <RouteMetaTags
        meta={{
          ...t.meta,
          title: `${t.title} | ${title}`,
        }}
      />

      <LayoutHeader>
        {t.title}
      </LayoutHeader>

      <SideLayout
        sidebar={(
          <SideNav>
            <SideNavItem
              icon={<UserCircleIcon size={18} />}
              href={sitemap.settings.me}
            >
              {t.pages.me.title}
            </SideNavItem>
          </SideNav>
        )}
      >
        {children}
      </SideLayout>
    </PageWithNavigationLayout>
  );
}
