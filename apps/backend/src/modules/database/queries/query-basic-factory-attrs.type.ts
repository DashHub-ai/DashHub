import type { DatabaseTables } from '../database.tables';
import type { KyselyDatabase } from '../types';

export type QueryBasicFactoryAttrs<K extends keyof DatabaseTables> = {
  table: K;
  db: KyselyDatabase;
};
