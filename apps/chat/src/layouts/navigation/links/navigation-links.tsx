import clsx from 'clsx';
import {
  FolderKanbanIcon,
  HomeIcon,
  MessageSquareIcon,
  PinIcon,
  WandSparklesIcon,
  ZapIcon,
} from 'lucide-react';
import { useState } from 'react';

import { useWindowListener } from '@dashhub/commons-front';
import { useI18n } from '~/i18n';
import { useHasWorkspaceOrganization } from '~/modules';
import { useSitemap } from '~/routes';

import { NavigationItem } from './navigation-item';

type NavigationLinksProps = {
  inMobileMenu?: boolean;
  className?: string;
  truncated?: boolean;
};

export function NavigationLinks({ truncated, inMobileMenu = false, className }: NavigationLinksProps) {
  const t = useI18n().pack.navigation;

  const sitemap = useSitemap();
  const hasOrganization = useHasWorkspaceOrganization();

  const [hideTitles, setHideTitles] = useState(getIsHideTitles);

  useWindowListener({
    resize: () => {
      setHideTitles(getIsHideTitles());
    },
  });

  function getIsHideTitles() {
    const width = window.innerWidth - (truncated ? 270 : 0);

    return width < 1024;
  }

  return (
    <ul
      className={clsx(
        'flex',
        className,
        inMobileMenu
          ? 'flex-col w-full items-start gap-4'
          : 'flex-nowrap overflow-x-auto xl:justify-center items-center gap-1 sm:gap-2 md:gap-4',
      )}
    >
      <NavigationItem
        path={sitemap.home}
        icon={<HomeIcon size={16} />}
        withTitle={!hideTitles}
      >
        {t.links.home}
      </NavigationItem>

      <NavigationItem
        path={sitemap.apps.index.generate({})}
        icon={<WandSparklesIcon size={16} />}
        disabled={!hasOrganization}
        withTitle={!hideTitles}
      >
        {t.links.apps}
      </NavigationItem>

      <NavigationItem
        path={sitemap.chats.index}
        icon={<MessageSquareIcon size={16} />}
        disabled={!hasOrganization}
        withTitle={!hideTitles}
      >
        {t.links.chats}
      </NavigationItem>

      <NavigationItem
        path={sitemap.pinnedMessages.index.generate({})}
        icon={<PinIcon size={16} />}
        disabled={!hasOrganization}
        withTitle={!hideTitles}
      >
        {t.links.pinnedMessages}
      </NavigationItem>

      <NavigationItem
        path={sitemap.projects.index.generate({})}
        icon={<FolderKanbanIcon size={16} />}
        disabled={!hasOrganization}
        withTitle={!hideTitles}
      >
        {t.links.projects}
      </NavigationItem>

      <NavigationItem
        path={sitemap.aiExternalAPIs.index.generate({})}
        icon={<ZapIcon size={16} />}
        disabled={!hasOrganization}
        withTitle={!hideTitles}
      >
        {t.links.aiExternalAPIs}
      </NavigationItem>
    </ul>
  );
}
