import type { PropsWithChildren } from 'react';

import { Link } from 'wouter';

import { useI18n } from '~/i18n';
import { useSitemap } from '~/routes';
import { useCheckReplaceableLinkPath } from '~/routes/use-check-replaceable-link-path';

export type SearchBarGroupEntryProps = PropsWithChildren & {
  header: string;
  viewAllHref?: string;
};

export function SearchBarGroupEntry({ children, header, viewAllHref }: SearchBarGroupEntryProps) {
  const t = useI18n().pack.searchBar;
  const sitemap = useSitemap();
  const checkReplaceableLinkPath = useCheckReplaceableLinkPath();

  const forceRedirectViewAllHref = viewAllHref && sitemap.forceRedirect.generate(viewAllHref);

  return (
    <div className="space-y-2 px-4 py-3">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-gray-900 text-sm dark:text-white">
          {header}
        </h3>

        {forceRedirectViewAllHref && (
          <Link
            href={forceRedirectViewAllHref}
            replace={checkReplaceableLinkPath(forceRedirectViewAllHref)}
            className="text-xs uk-link"
          >
            {t.viewAll}
          </Link>
        )}
      </div>

      <div className="gap-2 grid grid-cols-1">
        {children}
      </div>
    </div>
  );
}
