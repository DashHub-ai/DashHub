import type { TableRowWithId, TableWithIdColumn } from './table-with-id-column.type';

export type TableRowWithIdName = TableRowWithId & {
  name: string;
};

export type TableWithIdNameColumn = TableWithIdColumn & {
  name: string;
};
