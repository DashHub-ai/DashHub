import type { PropsWithChildren } from 'react';

import { BuildingIcon, UserCircleIcon } from 'lucide-react';

import { useSdkForLoggedIn } from '@llm/sdk';
import { useI18n } from '~/i18n';
import { LayoutHeader, PageWithNavigationLayout } from '~/layouts';
import { useHasWorkspaceOrganization } from '~/modules';
import { RouteMetaTags, useSitemap } from '~/routes';
import { SideLayout, SideNav, SideNavItem } from '~/ui';

type Props = PropsWithChildren & {
  title: string;
};

export function SettingsLayout({ title, children }: Props) {
  const t = useI18n().pack.routes.settings;
  const sitemap = useSitemap();
  const { guard } = useSdkForLoggedIn();
  const hasOrganization = useHasWorkspaceOrganization();

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
          <>
            <SideNav>
              <SideNavItem
                icon={<UserCircleIcon size={18} />}
                href={sitemap.settings.me}
              >
                {t.pages.me.title}
              </SideNavItem>
            </SideNav>

            {hasOrganization && guard.is.minimum.techUser && (
              <SideNav>
                <SideNavItem
                  icon={<BuildingIcon size={18} />}
                  href={sitemap.settings.organization}
                >
                  {t.pages.myOrganization.title}
                </SideNavItem>
              </SideNav>
            )}
          </>
        )}
      >
        {children}
      </SideLayout>
    </PageWithNavigationLayout>
  );
}
