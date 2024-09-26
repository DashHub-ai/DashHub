import type { TableWithAccessTimeColumns } from './table-with-access-time-columns.type';
import type { TableWithIdColumn } from './table-with-id-column.type';

export type TableWithDefaultColumns = TableWithIdColumn & TableWithAccessTimeColumns;
