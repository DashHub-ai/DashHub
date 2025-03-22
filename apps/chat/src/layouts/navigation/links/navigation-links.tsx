import clsx from 'clsx';
import {
  FolderKanbanIcon,
  HomeIcon,
  PinIcon,
  SettingsIcon,
  WandSparklesIcon,
} from 'lucide-react';

import { useSdkForLoggedIn } from '@llm/sdk';
import { useI18n } from '~/i18n';
import { useHasWorkspaceOrganization } from '~/modules';
import { useSitemap } from '~/routes';

import { NavigationItem } from './navigation-item';

type NavigationLinksProps = {
  inMobileMenu?: boolean;
};

export function NavigationLinks({ inMobileMenu = false }: NavigationLinksProps) {
  const t = useI18n().pack.navigation;

  const { guard } = useSdkForLoggedIn();
  const sitemap = useSitemap();
  const hasOrganization = useHasWorkspaceOrganization();

  return (
    <ul
      className={clsx(
        'flex',
        inMobileMenu
          ? 'flex-col w-full items-start gap-4'
          : 'flex-wrap justify-center items-center gap-1 sm:gap-2 md:gap-4',
      )}
    >
      <NavigationItem
        path={sitemap.chats.index}
        icon={<HomeIcon size={16} />}
        disabled={!hasOrganization}
      >
        {t.links.home}
      </NavigationItem>

      <NavigationItem
        path={sitemap.apps.index.generate({})}
        icon={<WandSparklesIcon size={16} />}
        disabled={!hasOrganization}
      >
        {t.links.apps}
      </NavigationItem>

      <NavigationItem
        path={sitemap.pinnedMessages.index.generate({})}
        icon={<PinIcon size={16} />}
        disabled={!hasOrganization}
      >
        {t.links.pinnedMessages}
      </NavigationItem>

      <NavigationItem
        path={sitemap.projects.index.generate({})}
        icon={<FolderKanbanIcon size={16} />}
        disabled={!hasOrganization}
      >
        {t.links.projects}
      </NavigationItem>

      {guard.is.minimum.techUser && (
        <NavigationItem
          path={sitemap.management.index}
          icon={<SettingsIcon size={16} />}
          disabled={!hasOrganization}
        >
          {t.links.management}
        </NavigationItem>
      )}
    </ul>
  );
}
