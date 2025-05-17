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
import { useWorkspaceOrganizationOrThrow } from '~/modules/workspace';
import { useSitemap } from '~/routes';

export function ProjectsHistorySidebarSection() {
  const { pack } = useI18n();

  return (
    <SidebarSection
      id="projects-history"
      title={pack.sidebar.projects.title}
      icon={<HistoryIcon size={18} />}
      defaultExpanded={false}
    >
      <ProjectsHistorySidebarContent />
    </SidebarSection>
  );
}

function ProjectsHistorySidebarContent() {
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
    return <SidebarLinksSkeleton count={5} />;
  }

  const links: SidebarLinkItem[] = value.data.items.map(item => ({
    href: sitemap.projects.show.generate({ pathParams: { id: item.id } }),
    label: item.name,
  }));

  return (
    <>
      <SidebarLinks links={links} />
      <SidebarSectionAllLink href={sitemap.projects.index.generate({})}>
        {pack.sidebar.projects.all}
      </SidebarSectionAllLink>
    </>
  );
}
