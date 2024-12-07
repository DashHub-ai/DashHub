import type {
  NormalizeSelectTableRow,
  TableId,
  TableRowWithIdName,
  TableWithArchivedAtColumn,
  TableWithDefaultColumns,
} from '../database';

export type AppsCategoriesTable = TableWithDefaultColumns &
  TableWithArchivedAtColumn & {
    name: string;
    description: string | null;
    icon: string;
    organization_id: TableId;
    parent_category_id: TableId | null;
  };

export type AppCategoryTableRow = NormalizeSelectTableRow<AppsCategoriesTable>;

export type AppTableRowWithRelations =
  & Omit<AppCategoryTableRow, 'parentCategoryId' | 'organizationId'>
  & {
    organization: TableRowWithIdName;
    parentCategory: TableRowWithIdName | null;
  };
