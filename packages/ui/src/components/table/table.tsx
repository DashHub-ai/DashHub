import type { ReactNode } from 'react';

import clsx from 'clsx';

import type { SdkTableRowWithIdT } from '@llm/sdk';

import { NoItemsPlaceholder } from '../list';

export type TableColumnItem = {
  id: number | string;
  name?: ReactNode;
  className?: string;
};

export type Props<I extends SdkTableRowWithIdT> = {
  className?: string;
  columns: TableColumnItem[];
  items: I[];
  children: (params: { item: I; index: number; }) => ReactNode;
};

export function Table<I extends SdkTableRowWithIdT>(
  {
    className,
    items,
    columns,
    children,
  }: Props<I>,
) {
  return (
    <div
      className={clsx(
        'uk-overflow-auto mt-4 rounded-md border border-border',
        className,
      )}
    >
      <table className="uk-table uk-table-middle uk-table-divider uk-table-hover uk-table-small">
        <thead>
          <tr>
            {columns.map(({ id, name, className }) => (
              <th key={id} className={clsx('p-2', className)}>
                {name}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {!items.length && (
            <tr>
              <td colSpan={columns.length}>
                <NoItemsPlaceholder />
              </td>
            </tr>
          )}

          {items.map((item, index) => children({
            item,
            index,
          }))}
        </tbody>
      </table>
    </div>
  );
}
