import type { PropsWithChildren } from 'react';

import { Link } from 'wouter';

import { useI18n } from '~/i18n';
import { useSitemap } from '~/routes';

type Props = PropsWithChildren & {
  root?: boolean;
};

export function LayoutHeader({ children, root }: Props) {
  const t = useI18n().pack.navigation.links;
  const sitemap = useSitemap();

  return (
    <div className="flex flex-col space-y-3">
      <nav aria-label="Breadcrumb">
        <ul className="uk-breadcrumb">
          <li>
            <Link href={sitemap.home}>{t.home}</Link>
          </li>

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
