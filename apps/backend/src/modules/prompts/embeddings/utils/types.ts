import type { TableRowWithId, TableRowWithIdName } from '~/modules/database';

export type MatchingEmbedding = TableRowWithId & {
  projectFile: TableRowWithIdName;
  text: string;
  isInternalKnowledge: boolean;
};
