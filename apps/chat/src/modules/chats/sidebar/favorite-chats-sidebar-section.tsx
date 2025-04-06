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

export function FavoriteChatsSidebarSection() {
  const { organization } = useWorkspaceOrganizationOrThrow();
  const sitemap = useSitemap();
  const { pack } = useI18n();
  const { sdks, session } = useSdkForLoggedIn();
  const value = useAsyncValue(
    pipe(
      sdks.dashboard.chats.search({
        creatorIds: [session.token.sub],
        organizationIds: [organization.id],
        excludeEmpty: true,
        offset: 0,
        limit: 10,
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
    href: sitemap.chat.generate({ pathParams: { id: item.id } }),
    label: item.summary.name.value || pack.chat.card.noTitle,
  }));

  return (
    <SidebarSection
      id="favorite-chats"
      title={pack.sidebar.favoriteChats.title}
      icon={<HeartIcon size={18} />}
      defaultExpanded={false}
    >
      <SidebarLinks links={links} />

      <SidebarSectionAllLink href={sitemap.chats.index}>
        {pack.sidebar.favoriteChats.all}
      </SidebarSectionAllLink>
    </SidebarSection>
  );
}
