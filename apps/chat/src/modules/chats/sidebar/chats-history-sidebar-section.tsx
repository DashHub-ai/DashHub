import { pipe } from 'fp-ts/lib/function';
import { HistoryIcon } from 'lucide-react';

import { tryOrThrowTE } from '@dashhub/commons';
import { useAsyncValue } from '@dashhub/commons-front';
import { useSdkForLoggedIn } from '@dashhub/sdk';
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

export function ChatsHistorySidebarSection() {
  const { pack } = useI18n();

  return (
    <SidebarSection
      id="chats-history"
      title={pack.sidebar.chats.title}
      icon={<HistoryIcon size={18} />}
      defaultExpanded
    >
      <ChatsHistorySidebarContent />
    </SidebarSection>
  );
}

function ChatsHistorySidebarContent() {
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
        limit: 20,
        archived: false,
      }),
      tryOrThrowTE,
    ),
    [],
  );

  if (value.status !== 'success') {
    return <SidebarLinksSkeleton />;
  }

  const links: SidebarLinkItem[] = value.data.items.map(item => ({
    href: sitemap.chat.generate({ pathParams: { id: item.id } }),
    label: item.summary.name.value || pack.chat.card.noTitle,
    suffix: <FavoriteStarButton favorite={{ type: 'chat', id: item.id }} />,
  }));

  return (
    <>
      <SidebarLinks links={links} />
      <SidebarSectionAllLink href={sitemap.chats.index}>
        {pack.sidebar.chats.all}
      </SidebarSectionAllLink>
    </>
  );
}
