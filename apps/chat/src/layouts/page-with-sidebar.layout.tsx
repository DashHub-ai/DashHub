import type { PropsWithChildren } from 'react';

import clsx from 'clsx';

import {
  AppsHistorySidebarSection,
  ChatsHistorySidebarSection,
  FavoriteAppsSidebarSection,
  FavoriteChatsSidebarSection,
  ProjectsHistorySidebarSection,
} from '~/modules';
import { useWorkspaceOrganization } from '~/modules/workspace/use-workspace-organization';

import { Footer } from './footer';
import { Navigation, type NavigationProps } from './navigation';
import { Sidebar, useSidebarToggledStorage } from './sidebar';

type Props = PropsWithChildren & {
  gapClassName?: string;
  withFooter?: boolean;
  backgroundClassName?: string;
  contentClassName?: string;
  navigationProps?: NavigationProps;
};

export function PageWithSidebarLayout(
  {
    children,
    gapClassName,
    contentClassName,
    backgroundClassName = 'bg-white',
    withFooter = true,
    navigationProps,
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
          <AppsHistorySidebarSection />
          <ChatsHistorySidebarSection />
        </Sidebar>
      )}

      <div
        className={clsx(
          'flex flex-col 2xl:px-16 min-h-screen',
          gapClassName ?? 'gap-8',
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
