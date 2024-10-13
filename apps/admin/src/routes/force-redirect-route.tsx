import { Redirect, useSearch } from 'wouter';

import { decodeSearchParams } from '@llm/commons';

import { useSitemap } from './use-sitemap';

export function ForceRedirectRoute() {
  const sitemap = useSitemap();
  const searchParams = useSearch();
  const { targetUrl } = decodeSearchParams(`?${searchParams}`);

  return (
    <Redirect
      to={targetUrl ? atob(targetUrl) : sitemap.home}
      replace
    />
  );
}
