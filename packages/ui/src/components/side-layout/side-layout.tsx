import type { PropsWithChildren, ReactNode } from 'react';

type SideLayoutProps = PropsWithChildren & {
  sidebar: ReactNode;
};

export function SideLayout({ sidebar, children }: SideLayoutProps) {
  return (
    <div className="flex gap-12">
      <aside className="w-64 shrink-0">
        {sidebar}
      </aside>
      <main className="flex-1 space-y-6">
        {children}
      </main>
    </div>
  );
}
