import clsx from 'clsx';

import type {
  SdkOffsetPaginationInputT,
  SdkTableRowWithIdT,
  SdkTableRowWithUuidT,
} from '@dashhub/sdk';

import { PaginatedList, type PaginatedListProps } from '../list';
import { Table, type Props as TableProps } from './table';

type Props<
  I extends SdkTableRowWithIdT | SdkTableRowWithUuidT,
  P extends SdkOffsetPaginationInputT,
> =
  & Omit<TableProps<I>, 'items'>
  & Omit<PaginatedListProps<I, P>, 'children'>
  & {
    spaced?: boolean;
  };

export function PaginatedTable<
  I extends SdkTableRowWithIdT | SdkTableRowWithUuidT,
  P extends SdkOffsetPaginationInputT,
>({ result, loading = false, pagination, className, footerProps, spaced = true, ...props }: Props<I, P>) {
  return (
    <PaginatedList
      result={result}
      loading={loading}
      pagination={pagination}
      withEmptyPlaceholder={false}
      footerProps={footerProps}
    >
      {({ items }) => (
        <Table
          items={items}
          className={clsx(className, spaced && 'mt-6')}
          {...props}
        />
      )}
    </PaginatedList>
  );
}
