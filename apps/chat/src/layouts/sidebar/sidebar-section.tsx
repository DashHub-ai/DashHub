import type { PropsWithChildren, ReactNode } from 'react';

type SidebarSectionProps = PropsWithChildren & {
  title: string;
  icon: ReactNode;
};

export function SidebarSection({ title, icon, children }: SidebarSectionProps) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4 px-2 text-gray-500">
        <span>{icon}</span>
        <h3 className="font-dmsans font-semibold text-sm">
          {title}
        </h3>
      </div>

      <div className="flex flex-col gap-2">
        {children}
      </div>
    </section>
  );
}
