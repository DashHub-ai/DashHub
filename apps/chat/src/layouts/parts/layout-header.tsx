import type { PropsWithChildren, ReactNode } from 'react';

import { Link } from 'wouter';

import { useI18n } from '~/i18n';
import { useSitemap } from '~/routes';

type Props = PropsWithChildren & {
  withBreadcrumbs?: boolean;
  breadcrumbs?: ReactNode;
  root?: boolean;
};

export function LayoutHeader({ children, breadcrumbs, withBreadcrumbs = true, root }: Props) {
  const t = useI18n().pack;
  const sitemap = useSitemap();

  return (
    <div className="flex flex-col space-y-3">
      {withBreadcrumbs && (
        <nav aria-label="Breadcrumb">
          <ul className="uk-breadcrumb">
            <li>
              <Link href={sitemap.home}>
                {t.breadcrumbs.routes.home}
              </Link>
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
      )}

      <h1 className="font-bold text-3xl tracking-tight">
        {children}
      </h1>
    </div>
  );
}
