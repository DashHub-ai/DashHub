import type { ReactNode } from 'react';

type SideNavProps = {
  children: ReactNode;
};

export function SideNav({ children }: SideNavProps) {
  return (
    <nav className="space-y-1">
      {children}
    </nav>
  );
}
