import type { ReactNode } from 'react';

import { Link } from 'wouter';

import { useSitemap } from '~/routes';
import { useCheckReplaceableLinkPath } from '~/routes/use-check-replaceable-link-path';

type Props = {
  href: string;
  icon: ReactNode;
  title: string;
  subTitle: string;
};

export function SearchBarItemEntry({ href, icon, title, subTitle }: Props) {
  const checkReplaceableLinkPath = useCheckReplaceableLinkPath();
  const forceRedirectHref = useSitemap().forceRedirect.generate(href);

  return (
    <Link
      className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
      href={forceRedirectHref}
      replace={checkReplaceableLinkPath(href)}
    >
      <div className="w-5 h-5 text-gray-400">
        {icon}
      </div>

      <div className="ml-3">
        <div className="text-sm font-medium text-gray-900 dark:text-white">
          {title}
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          {subTitle}
        </div>
      </div>
    </Link>
  );
}
