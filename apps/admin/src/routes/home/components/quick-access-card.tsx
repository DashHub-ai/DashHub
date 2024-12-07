import type { ReactNode } from 'react';

import { ArrowRightIcon } from 'lucide-react';
import { Link } from 'wouter';

import { useI18n } from '~/i18n';

type Props = {
  icon: ReactNode;
  title: string;
  href: string;
  description?: string;
};

export function QuickAccessCard({ icon, title, href, description }: Props) {
  const { pack } = useI18n();

  return (
    <div className="relative min-h-[180px]">
      <Link href={href}>
        <a className="flex flex-col hover:border-primary border border-border rounded-lg h-full transition-colors cursor-pointer group">
          <div className="flex flex-col flex-1 p-4">
            <div className="flex items-center gap-2 mb-3">
              {icon}
              <h3 className="font-medium text-sm">{title}</h3>
            </div>
            {description && (
              <p className="py-2 line-clamp-4 text-muted-foreground text-sm">{description}</p>
            )}
          </div>

          <div className="px-4 pb-3">
            <div className="group-hover:text-primary flex items-center gap-1.5 bg-secondary px-2.5 py-1 rounded w-fit text-muted-foreground text-xs transition-colors">
              {pack.buttons.open}
              <ArrowRightIcon size={12} className="relative top-px" />
            </div>
          </div>
        </a>
      </Link>
    </div>
  );
}
