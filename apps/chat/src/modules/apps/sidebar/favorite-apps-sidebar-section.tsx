import { pipe } from 'fp-ts/lib/function';
import { HeartIcon } from 'lucide-react';

import { tryOrThrowTE } from '@dashhub/commons';
import { useAsyncValue } from '@dashhub/commons-front';
import { useSdkForLoggedIn, useSdkOnFavoriteAction } from '@dashhub/sdk';
import { useI18n } from '~/i18n';
import {
  type SidebarLinkItem,
  SidebarLinks,
  SidebarLinksSkeleton,
  SidebarSection,
  SidebarSectionAllLink,
} from '~/layouts';
import { FavoriteStarButton } from '~/modules/favorites';
import { useWorkspaceOrganizationOrThrow } from '~/modules/workspace';
import { useSitemap } from '~/routes';

export function FavoriteAppsSidebarSection() {
  const { pack } = useI18n();

  return (
    <SidebarSection
      id="favorite-apps"
      title={pack.sidebar.favoriteApps.title}
      icon={<HeartIcon size={18} />}
      defaultExpanded={false}
    >
      <FavoriteAppsSidebarContent />
    </SidebarSection>
  );
}

function FavoriteAppsSidebarContent() {
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
    return <SidebarLinksSkeleton count={4} />;
  }

  const links: SidebarLinkItem[] = value.data.items.map(item => ({
    label: item.name,
    href: sitemap.forceRedirect.generate(
      sitemap.apps.index.generate({ searchParams: { phrase: item.name } }),
    ),
    suffix: <FavoriteStarButton favorite={{ type: 'app', id: item.id }} />,
  }));

  return (
    <>
      <SidebarLinks links={links} />
      <SidebarSectionAllLink
        href={sitemap.forceRedirect.generate(
          sitemap.apps.index.generate({ searchParams: { favorites: true } }),
        )}
      >
        {pack.sidebar.favoriteApps.all}
      </SidebarSectionAllLink>
    </>
  );
}
