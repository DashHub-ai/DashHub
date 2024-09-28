import type { ReactNode } from 'react';

import clsx from 'clsx';

import { NoItemsPlaceholder } from './no-items-placeholder';

export type BasicRecordsListProps<T> = {
  className?: string;
  items: T[];
  children: (attrs: { item: T; index: number; }) => ReactNode;
};

export function BasicRecordsList<T>({
  className,
  items,
  children,
}: BasicRecordsListProps<T>) {
  if (!items.length) {
    return <NoItemsPlaceholder />;
  }

  return (
    <ul className={clsx('uk-list', className)}>
      {items.map((item, index) => children({ item, index }))}
    </ul>
  );
}
