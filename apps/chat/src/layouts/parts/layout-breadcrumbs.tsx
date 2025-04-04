import type { ReactNode } from 'react';

import { Link } from 'wouter';

import { useI18n } from '~/i18n';
import { useSitemap } from '~/routes';

type Props = {
  currentBreadcrumb?: ReactNode;
  breadcrumbs?: ReactNode;
  root?: boolean;
  className?: string;
};

export function LayoutBreadcrumbs({ currentBreadcrumb, breadcrumbs, root, className }: Props) {
  const t = useI18n().pack;
  const sitemap = useSitemap();

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ul className="flex items-center uk-breadcrumb">
        <li>
          <Link href={sitemap.home}>
            {t.breadcrumbs.routes.home}
          </Link>
        </li>

        {breadcrumbs}

        {!root && (
          <li aria-current="page">
            {currentBreadcrumb}
          </li>
        )}
      </ul>
    </nav>
  );
}
