import type { PropsWithChildren, ReactNode } from 'react';

export type Props = PropsWithChildren & {
  icon: ReactNode;
  title: string;
};

export function QuickAccessSection({ icon, title, children }: Props) {
  return (
    <section>
      <h2 className="flex items-center gap-2 mb-6 font-medium text-base">
        {icon}
        {title}
      </h2>
      <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {children}
      </div>
    </section>
  );
}
