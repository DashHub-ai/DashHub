import type { ReactNode } from 'react';

type SideNavProps = {
  children: ReactNode;
};

export function SideNav({ children }: SideNavProps) {
  return (
    <nav className="flex flex-col gap-y-1">
      {children}
    </nav>
  );
}
