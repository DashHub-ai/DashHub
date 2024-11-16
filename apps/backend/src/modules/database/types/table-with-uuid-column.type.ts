import type { Generated } from 'kysely';

export type TableUuid = string;

export type TableRowWithUuid = {
  id: TableUuid;
};

export type TableWithUuidColumn = {
  id: Generated<TableUuid>;
};
