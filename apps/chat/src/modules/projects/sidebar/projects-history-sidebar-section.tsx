import { pipe } from 'fp-ts/lib/function';
import { HistoryIcon } from 'lucide-react';

import { tryOrThrowTE } from '@llm/commons';
import { useAsyncValue } from '@llm/commons-front';
import { useSdkForLoggedIn } from '@llm/sdk';
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

export function ProjectsHistorySidebarSection() {
  const { organization } = useWorkspaceOrganizationOrThrow();
  const sitemap = useSitemap();
  const { pack } = useI18n();
  const { sdks, session } = useSdkForLoggedIn();
  const value = useAsyncValue(
    pipe(
      sdks.dashboard.projects.search({
        creatorIds: [session.token.sub],
        organizationIds: [organization.id],
        offset: 0,
        limit: 5,
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
    href: sitemap.projects.show.generate({ pathParams: { id: item.id } }),
    label: item.name,
  }));

  return (
    <SidebarSection
      title={pack.sidebar.projects.title}
      icon={<HistoryIcon size={18} />}
    >
      <SidebarLinks links={links} />
      <SidebarSectionAllLink href={sitemap.projects.index.generate({})}>
        {pack.sidebar.projects.all}
      </SidebarSectionAllLink>
    </SidebarSection>
  );
}
