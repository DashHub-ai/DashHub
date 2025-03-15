import type { PropsWithChildren } from 'react';

import clsx from 'clsx';

import { ChatsHistorySidebarSection } from '~/modules/chats/sidebar/chats-history-sidebar-section';
import { ProjectsHistorySidebarSection } from '~/modules/projects/sidebar/projects-history-sidebar-section';
import { useWorkspaceOrganization } from '~/modules/workspace/use-workspace-organization';

import { Footer } from './footer';
import { Navigation, type NavigationProps } from './navigation';
import { Sidebar, useSidebarToggledStorage } from './sidebar';

type Props = PropsWithChildren & {
  withFooter?: boolean;
  backgroundClassName?: string;
  contentClassName?: string;
  navigationProps?: NavigationProps;
};

export function PageWithSidebarLayout(
  {
    children,
    contentClassName,
    navigationProps,
    backgroundClassName = 'bg-white',
    withFooter = true,
  }: Props,
) {
  const { organization } = useWorkspaceOrganization();
  const sidebarToggledStorage = useSidebarToggledStorage();
  const isSidebarVisible = !!sidebarToggledStorage.getOrNull();

  return (
    <main
      className={clsx(
        'min-h-screen',
        isSidebarVisible && '2xl:pl-[300px]',
        backgroundClassName,
      )}
      key={organization?.id ?? 'unknown'}
    >
      <Sidebar>
        {organization && (
          <>
            <ProjectsHistorySidebarSection />
            <ChatsHistorySidebarSection />
          </>
        )}
      </Sidebar>

      <div className="flex flex-col">
        <Navigation {...navigationProps} />

        <div
          className={clsx(
            'space-y-8 p-6 px-14 w-full',
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
