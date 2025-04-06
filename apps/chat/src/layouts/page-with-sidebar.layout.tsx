import type { PropsWithChildren } from 'react';

import clsx from 'clsx';

import { FavoriteAppsSidebarSection, FavoriteChatsSidebarSection } from '~/modules';
import { ChatsHistorySidebarSection } from '~/modules/chats/sidebar/chats-history-sidebar-section';
import { ProjectsHistorySidebarSection } from '~/modules/projects/sidebar/projects-history-sidebar-section';
import { useWorkspaceOrganization } from '~/modules/workspace/use-workspace-organization';

import { Footer } from './footer';
import { Navigation, type NavigationProps } from './navigation';
import { LayoutBackgroundDecorations } from './parts/layout-background-decorations';
import { Sidebar, useSidebarToggledStorage } from './sidebar';

type Props = PropsWithChildren & {
  withFooter?: boolean;
  backgroundClassName?: string;
  contentClassName?: string;
  navigationProps?: NavigationProps;
  withBackgroundDecorations?: boolean;
};

export function PageWithSidebarLayout(
  {
    children,
    contentClassName,
    backgroundClassName = 'bg-white',
    withFooter = true,
    navigationProps,
    withBackgroundDecorations = true,
  }: Props,
) {
  const { organization } = useWorkspaceOrganization();
  const sidebarToggledStorage = useSidebarToggledStorage();
  const isSidebarVisible = !!sidebarToggledStorage.getOrNull();

  return (
    <main
      className={clsx(
        'min-h-screen',
        isSidebarVisible && organization && '2xl:pl-[300px]',
        backgroundClassName,
      )}
      key={organization?.id ?? 'unknown'}
    >
      {organization && (
        <Sidebar>
          <FavoriteAppsSidebarSection />
          <FavoriteChatsSidebarSection />
          <ProjectsHistorySidebarSection />
          <ChatsHistorySidebarSection />
        </Sidebar>
      )}

      {withBackgroundDecorations && (
        <LayoutBackgroundDecorations sidebarWidth={isSidebarVisible ? 300 : 0} />
      )}

      <div
        className={clsx(
          'flex flex-col gap-8 2xl:px-16 min-h-screen',
          !isSidebarVisible && organization && '2xl:pl-8',
        )}
      >
        <Navigation {...navigationProps} />

        <div
          className={clsx(
            'flex-1 space-y-8 w-full',
            'container mx-auto',
            contentClassName,
          )}
        >
          {children}
        </div>

        {withFooter && <Footer />}
      </div>
    </main>
  );
}
