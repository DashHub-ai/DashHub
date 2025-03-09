import type { PropsWithChildren } from 'react';

import { ArrowRight } from 'lucide-react';
import { Link } from 'wouter';

type Props = PropsWithChildren & {
  href: string;
};

export function SidebarSectionAllLink({ href, children }: Props) {
  return (
    <Link
      href={href}
      className="flex justify-start items-center gap-1 px-2 text-gray-500 hover:text-gray-700 text-sm transition-colors"
    >
      <span>{children}</span>
      <ArrowRight className="top-[1px] relative w-3 h-3" />
    </Link>
  );
}
