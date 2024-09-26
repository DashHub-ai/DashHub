import type { TableId, TableWithDefaultColumns } from '~/modules/database';

export type OrganizationsS3BucketsTable = TableWithDefaultColumns & {
  bucket_id: TableId;
  organization_id: TableId;
  default: boolean;
};
