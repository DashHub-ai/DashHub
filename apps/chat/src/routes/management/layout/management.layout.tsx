import type { PropsWithChildren } from 'react';

import { BotIcon, FolderOpen, UserCircleIcon, UsersIcon } from 'lucide-react';

import { SideLayout, SideNav, SideNavItem } from '@llm/ui';
import { useI18n } from '~/i18n';
import { LayoutHeader, PageWithNavigationLayout } from '~/layouts';
import { RouteMetaTags, useSitemap } from '~/routes';

type Props = PropsWithChildren & {
  title: string;
};

export function ManagementLayout({ title, children }: Props) {
  const t = useI18n().pack.routes.management;
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
              href={sitemap.management.users}
            >
              {t.pages.users.title}
            </SideNavItem>

            <SideNavItem
              icon={<UsersIcon size={18} />}
              href={sitemap.management.usersGroups}
            >
              {t.pages.usersGroups.title}
            </SideNavItem>

            <div className="py-4">
              <hr />
            </div>

            <SideNavItem
              icon={<BotIcon size={18} />}
              href={sitemap.management.aiModels}
            >
              {t.pages.aiModels.title}
            </SideNavItem>

            <SideNavItem
              icon={<FolderOpen size={18} />}
              href={sitemap.management.s3Buckets}
            >
              {t.pages.s3Buckets.title}
            </SideNavItem>
          </SideNav>
        )}
      >
        {children}
      </SideLayout>
    </PageWithNavigationLayout>
  );
}
