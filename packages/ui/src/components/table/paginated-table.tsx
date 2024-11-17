import clsx from 'clsx';

import type {
  SdkOffsetPaginationInputT,
  SdkTableRowWithIdT,
  SdkTableRowWithUuidT,
} from '@llm/sdk';

import { PaginatedList, type PaginatedListProps } from '../list';
import { Table, type Props as TableProps } from './table';

type Props<
  I extends SdkTableRowWithIdT | SdkTableRowWithUuidT,
  P extends SdkOffsetPaginationInputT,
> =
  & Omit<TableProps<I>, 'items'>
  & Omit<PaginatedListProps<I, P>, 'children'>;

export function PaginatedTable<
  I extends SdkTableRowWithIdT | SdkTableRowWithUuidT,
  P extends SdkOffsetPaginationInputT,
>({ result, loading, pagination, className, ...props }: Props<I, P>) {
  return (
    <PaginatedList
      result={result}
      loading={loading}
      pagination={pagination}
      withEmptyPlaceholder={false}
    >
      {({ items }) => (
        <Table
          items={items}
          className={clsx(className, 'mt-6')}
          {...props}
        />
      )}
    </PaginatedList>
  );
}
