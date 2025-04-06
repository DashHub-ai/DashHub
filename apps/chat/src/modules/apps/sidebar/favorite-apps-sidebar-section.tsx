import { pipe } from 'fp-ts/lib/function';
import { HeartIcon } from 'lucide-react';

import { tryOrThrowTE } from '@llm/commons';
import { useAsyncValue } from '@llm/commons-front';
import { useSdkForLoggedIn, useSdkOnFavoriteAction } from '@llm/sdk';
import { useI18n } from '~/i18n';
import {
  type SidebarLinkItem,
  SidebarLinks,
  SidebarLinksSkeleton,
  SidebarSection,
  SidebarSectionAllLink,
} from '~/layouts';
import { useWorkspaceOrganizationOrThrow } from '~/modules/workspace';
import { useSitemap } from '~/routes';

export function FavoriteAppsSidebarSection() {
  const { organization } = useWorkspaceOrganizationOrThrow();
  const sitemap = useSitemap();
  const { pack } = useI18n();
  const { sdks } = useSdkForLoggedIn();
  const value = useAsyncValue(
    pipe(
      sdks.dashboard.apps.search({
        organizationIds: [organization.id],
        offset: 0,
        limit: 4,
        archived: false,
        favorites: true,
        sort: 'favorites:desc',
      }),
      tryOrThrowTE,
    ),
    [],
  );

  useSdkOnFavoriteAction(() => {
    void value.silentReload();
  });

  if (value.status !== 'success') {
    return <SidebarLinksSkeleton count={3} />;
  }

  if (!value.data.total) {
    return null;
  }

  const links: SidebarLinkItem[] = value.data.items.map(item => ({
    label: item.name,
    href: sitemap.forceRedirect.generate(
      sitemap.apps.index.generate({ searchParams: { phrase: item.name } }),
    ),
  }));

  return (
    <SidebarSection
      id="favorite-apps"
      title={pack.sidebar.favoriteApps.title}
      icon={<HeartIcon size={18} />}
      defaultExpanded={false}
    >
      <SidebarLinks links={links} />

      <SidebarSectionAllLink
        href={sitemap.forceRedirect.generate(
          sitemap.apps.index.generate({ searchParams: { favorites: true } }),
        )}
      >
        {pack.sidebar.favoriteApps.all}
      </SidebarSectionAllLink>
    </SidebarSection>
  );
}
