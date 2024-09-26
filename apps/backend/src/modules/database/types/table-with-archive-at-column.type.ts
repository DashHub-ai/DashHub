import type { ColumnType } from 'kysely';

export type TableWithArchivedAtColumn = {
  archived: ColumnType<boolean, never, never>;
  archived_at: Date | null;
};

export type OmitTableArchivedAtKeys<T> = Omit<T, keyof TableWithArchivedAtColumn>;
