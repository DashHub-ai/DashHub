import type { ReactNode } from 'react';

import type { SdkOffsetPaginationOutputT, SdkTableRowWithIdNameT } from '@llm/sdk';

import {
  SearchBarGroupEntry,
  type SearchBarGroupEntryProps,
  SearchBarItemEntry,
} from '../entry';

type Props = {
  groupProps: SearchBarGroupEntryProps;
  icon: ReactNode;
  result: SdkOffsetPaginationOutputT<
    SdkTableRowWithIdNameT & {
      href: string;
      subTitle: string;
    }
  >;
};

export function SearchResultGroup(
  {
    icon,
    groupProps,
    result,
  }: Props,
) {
  return (
    <SearchBarGroupEntry {...groupProps}>
      {result.items.map(item => (
        <SearchBarItemEntry
          key={item.id}
          href={item.href}
          icon={icon}
          subTitle={item.subTitle}
          title={item.name}
        />
      ))}
    </SearchBarGroupEntry>
  );
}
