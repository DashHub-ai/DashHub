import {
  FolderKanbanIcon,
  GraduationCapIcon,
  MessageSquareTextIcon,
  SettingsIcon,
  WandSparklesIcon,
} from 'lucide-react';

import { useI18n } from '~/i18n';
import { useHasWorkspaceOrganization } from '~/modules';
import { useSitemap } from '~/routes';

import { NavigationItem } from './navigation-item';
import { StayTunedNavigationItem } from './stay-tuned-navigation-item';

export function NavigationLinks() {
  const t = useI18n().pack.navigation;
  const sitemap = useSitemap();
  const hasOrganization = useHasWorkspaceOrganization();

  return (
    <ul className="flex items-center gap-4 ml-5">
      <NavigationItem
        path={sitemap.home}
        icon={<MessageSquareTextIcon size={16} />}
        disabled={!hasOrganization}
      >
        {t.links.home}
      </NavigationItem>

      <NavigationItem
        path={sitemap.apps.index}
        icon={<WandSparklesIcon size={16} />}
        disabled={!hasOrganization}
      >
        {t.links.apps}
      </NavigationItem>

      <NavigationItem
        path={sitemap.projects.index}
        icon={<FolderKanbanIcon size={16} />}
        disabled={!hasOrganization}
      >
        {t.links.projects}
      </NavigationItem>

      <StayTunedNavigationItem
        path={sitemap.experts}
        icon={<GraduationCapIcon size={16} />}
        disabled={!hasOrganization}
      >
        {t.links.experts}
      </StayTunedNavigationItem>

      <NavigationItem
        path={sitemap.management.index}
        icon={<SettingsIcon size={16} />}
        disabled={!hasOrganization}
      >
        {t.links.management}
      </NavigationItem>
    </ul>
  );
}
