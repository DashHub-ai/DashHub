import type { PropsWithChildren, ReactNode } from 'react';

import { Link } from 'wouter';

import { useI18n } from '~/i18n';
import { useSitemap } from '~/routes';

type Props = PropsWithChildren & {
  breadcrumbs?: ReactNode;
  root?: boolean;
};

export function LayoutHeader({ children, breadcrumbs, root }: Props) {
  const t = useI18n().pack;
  const sitemap = useSitemap();

  return (
    <div className="flex flex-col space-y-3">
      <nav aria-label="Breadcrumb">
        <ul className="uk-breadcrumb">
          <li>
            <Link href={sitemap.projects}>{t.breadcrumbs.routes.home}</Link>
          </li>

          {breadcrumbs}

          {!root && (
            <li>
              <span aria-current="page">
                {children}
              </span>
            </li>
          )}
        </ul>
      </nav>

      <h1 className="text-3xl font-bold tracking-tight">
        {children}
      </h1>
    </div>
  );
}
