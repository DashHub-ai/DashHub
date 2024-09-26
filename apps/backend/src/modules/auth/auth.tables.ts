import type { ColumnType } from 'kysely';

import type { TableId, TableWithDefaultColumns } from '~/modules/database';

export type AuthPasswordsTable = TableWithDefaultColumns & {
  user_id: TableId;
  salt: string;
  hash: string;
};

export type AuthEmailsTable = TableWithDefaultColumns & {
  user_id: TableId;
  token: ColumnType<string, string | undefined, string>;
  expire_at: ColumnType<Date, Date | undefined, Date>;
};

export type AuthResetPasswordsTable = TableWithDefaultColumns & {
  user_id: TableId;
  token: ColumnType<string, string | undefined, string>;
  expire_at: ColumnType<Date, Date | undefined, Date>;
};
