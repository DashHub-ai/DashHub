import type { Kysely, QueryCreator, SelectQueryBuilder } from 'kysely';

// eslint-disable-next-line antfu/no-import-dist, antfu/no-import-node-modules-by-path
import type { From } from '../../../../../../node_modules/kysely/dist/esm/parser/table-parser';
import type { DatabaseTables } from '../database.tables';

export { From };

export type KyselyQueryCreator = QueryCreator<DatabaseTables>;

export type KyselySelectCreator<T extends keyof DatabaseTables> =
  SelectQueryBuilder<From<DatabaseTables, T>, T, unknown>;

export type KyselyDatabase = Kysely<DatabaseTables>;
