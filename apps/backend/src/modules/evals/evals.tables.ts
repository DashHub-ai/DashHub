import type { ColumnType } from 'kysely';

import type {
  NormalizeSelectTableRow,
  TableId,
  TableRowWithIdName,
  TableWithDefaultColumns,
} from '../database';

export type EvalSuitesTable = TableWithDefaultColumns & {
  organization_id: ColumnType<TableId, TableId, never>;
  name: string;
  description: string | null;
};

export type EvalSuiteTableRow = NormalizeSelectTableRow<EvalSuitesTable>;

export type EvalSuiteTableRowWithRelations = Omit<EvalSuiteTableRow, 'organizationId'> & {
  organization: TableRowWithIdName;
};

export type EvalCasesTable = TableWithDefaultColumns & {
  suite_id: ColumnType<TableId, TableId, never>;
  input_message: string;
  expected_note: string | null;
};

export type EvalCaseTableRow = NormalizeSelectTableRow<EvalCasesTable>;

export const EVAL_RUN_STATUSES = ['pending', 'running', 'completed', 'failed'] as const;
export type EvalRunStatus = typeof EVAL_RUN_STATUSES[number];

export type EvalRunsTable = TableWithDefaultColumns & {
  suite_id: ColumnType<TableId, TableId, never>;
  ai_model_id: ColumnType<TableId, TableId, never>;
  status: EvalRunStatus;
};

export type EvalRunTableRow = NormalizeSelectTableRow<EvalRunsTable>;

export type EvalResultsTable = TableWithDefaultColumns & {
  run_id: ColumnType<TableId, TableId, never>;
  case_id: ColumnType<TableId, TableId, never>;
  ai_response: string | null;
  latency_ms: number | null;
  error_message: string | null;
};

export type EvalResultTableRow = NormalizeSelectTableRow<EvalResultsTable>;
