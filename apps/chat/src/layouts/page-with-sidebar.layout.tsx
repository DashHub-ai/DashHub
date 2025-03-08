import type { PropsWithChildren } from 'react';

import clsx from 'clsx';
import { StarIcon } from 'lucide-react';

import { Footer } from './footer';
import { Sidebar, SidebarLinks, SidebarSection } from './sidebar';

type Props = PropsWithChildren & {
  withFooter?: boolean;
  wrapWithContainer?: boolean;
  backgroundClassName?: string;
  contentClassName?: string;
};

export function PageWithSidebarLayout(
  {
    children,
    contentClassName,
    backgroundClassName = 'bg-white',
    wrapWithContainer = true,
    withFooter = true,
  }: Props,
) {
  return (
    <main className={clsx('flex min-h-screen', backgroundClassName)}>
      <Sidebar>
        <SidebarSection
          title="Starred Chats"
          icon={<StarIcon size={18} />}
        >
          <SidebarLinks
            links={[
              {
                label: 'Starred Chats',
                href: '/starred-chats',
              },
              {
                label: 'Starred Chats 2',
                href: '/starred-chats-2',
              },
              {
                label: 'Starred Chats 3',
                href: '/starred-chats-3',
              },
            ]}
          />
        </SidebarSection>

        <SidebarSection
          title="Starred Chats"
          icon={<StarIcon size={18} />}
        >
          AAA
        </SidebarSection>
      </Sidebar>

      <div className="flex flex-col flex-1">
        <div
          className={clsx(
            'flex-1 mx-auto p-6 w-full',
            wrapWithContainer && 'container max-w-6xl',
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
