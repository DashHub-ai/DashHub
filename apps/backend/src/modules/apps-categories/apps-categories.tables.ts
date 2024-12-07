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
    parent_category_id: TableId | null;
  };

export type AppCategoryTableRow = NormalizeSelectTableRow<AppsCategoriesTable>;

export type AppTableRowWithRelations = Omit<AppCategoryTableRow, 'parentCategoryId'> & {
  parentCategory: TableRowWithIdName | null;
};
