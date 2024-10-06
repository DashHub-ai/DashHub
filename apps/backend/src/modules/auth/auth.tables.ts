import type { ColumnType } from 'kysely';

import type { TableId, TableWithDefaultColumns } from '~/modules/database';

export type AuthPasswordsTable = TableWithDefaultColumns & {
  user_id: TableId;
  salt: string;
  hash: string;
};

export type AuthEmailsTable = TableWithDefaultColumns & {
  user_id: TableId;
  token: string | null;
  expire_at: ColumnType<Date, Date | undefined, Date>;
};

export type AuthResetPasswordsTable = TableWithDefaultColumns & {
  user_id: TableId;
  token: string;
  expire_at: ColumnType<Date, Date | undefined, Date>;
};
