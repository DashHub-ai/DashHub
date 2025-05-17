import { useLocation } from 'wouter';

import { arePathsEqual } from '@dashhub/commons';

export function useCheckReplaceableLinkPath() {
  const [location] = useLocation();

  return (href: string) => arePathsEqual(location, href);
}
