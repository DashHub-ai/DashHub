import type { Generated } from 'kysely';

export type TableId = number;

export type TableRowWithId = {
  id: TableId;
};

export type TableWithIdColumn = {
  id: Generated<TableId>;
};
