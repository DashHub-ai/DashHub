import type { PropsWithChildren } from 'react';

import {
  BotIcon,
  BuildingIcon,
  FolderOpen,
  SearchIcon,
  UserCircleIcon,
  UsersIcon,
} from 'lucide-react';

import { useSdkForLoggedIn } from '@llm/sdk';
import { useI18n } from '~/i18n';
import { LayoutHeader, PageWithNavigationLayout } from '~/layouts';
import { useHasWorkspaceOrganization } from '~/modules';
import { RouteMetaTags, useSitemap } from '~/routes';
import { SideLayout, SideNav, SideNavItem } from '~/ui';

type Props = PropsWithChildren & {
  title: string;
};

export function ManagementLayout({ title, children }: Props) {
  const t = useI18n().pack.routes.management;
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

            {hasOrganization && guard.is.minimum.techUser && (
              <SideNavItem
                icon={<BuildingIcon size={18} />}
                href={sitemap.management.organization}
              >
                {t.pages.organization.title}
              </SideNavItem>
            )}

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
              icon={<SearchIcon size={18} />}
              href={sitemap.management.searchEngines}
            >
              {t.pages.searchEngines.title}
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
