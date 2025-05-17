import type { ReactNode } from 'react';

import clsx from 'clsx';

import type { SdkTableRowWithIdT, SdkTableRowWithUuidT } from '@dashhub/sdk';

import { NoItemsPlaceholder } from '../list';

export type TableColumnItem = {
  id: number | string;
  name?: ReactNode;
  className?: string;
};

export type Props<I extends SdkTableRowWithIdT | SdkTableRowWithUuidT,> = {
  className?: string;
  columns: TableColumnItem[];
  items: I[];
  children: (params: { item: I; index: number; }) => ReactNode;
};

export function Table<I extends SdkTableRowWithIdT | SdkTableRowWithUuidT>(
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
        'border border-border rounded-md uk-overflow-auto',
        className,
      )}
    >
      <table className="uk-table uk-table-divider uk-table-hover uk-table-middle uk-table-small">
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
