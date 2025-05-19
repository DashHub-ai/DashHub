import type { ColumnType } from 'kysely';

import type { SnakeToCamelCase } from '@dashhub/commons';

export type TableWithAccessTimeColumns = {
  created_at: ColumnType<Date, never, never>;
  updated_at: ColumnType<Date, never, Date>;
};

export type DropTableRowAccessTime<T> = Omit<
  T,
  SnakeToCamelCase<keyof TableWithAccessTimeColumns>
>;
