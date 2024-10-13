import type { PropsWithChildren } from 'react';

import { Link } from 'wouter';

import { useI18n } from '~/i18n';
import { useSitemap } from '~/routes';
import { useCheckReplaceableLinkPath } from '~/routes/use-check-replaceable-link-path';

export type SearchBarGroupEntryProps = PropsWithChildren & {
  header: string;
  viewAllHref: string;
};

export function SearchBarGroupEntry({ children, header, viewAllHref }: SearchBarGroupEntryProps) {
  const t = useI18n().pack.modules.searchBar;
  const checkReplaceableLinkPath = useCheckReplaceableLinkPath();
  const forceRedirectViewAllHref = useSitemap().forceRedirect.generate(viewAllHref);

  return (
    <div className="px-4 py-3 space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
          {header}
        </h3>

        <Link
          href={forceRedirectViewAllHref}
          replace={checkReplaceableLinkPath(forceRedirectViewAllHref)}
          className="uk-link text-xs"
        >
          {t.viewAll}
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {children}
      </div>
    </div>
  );
}
