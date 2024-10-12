import type {
  NormalizeSelectTableRow,
  TableId,
  TableRowWithIdName,
  TableWithArchivedAtColumn,
  TableWithDefaultColumns,
} from '~/modules/database';
import type { S3ResourcesBucketTableRow } from '~/modules/s3';

export type OrganizationsS3BucketsTable = TableWithDefaultColumns
  & TableWithArchivedAtColumn
  & {
    bucket_id: TableId;
    organization_id: TableId;
    default: boolean;
  };

export type OrganizationS3BucketTableRow = NormalizeSelectTableRow<OrganizationsS3BucketsTable>;

export type OrganizationS3InnerBucketRelation = Pick<
  S3ResourcesBucketTableRow,
  'id' | 'name' | 'accessKeyId' | 'secretAccessKey' | 'region'
>;

export type OrganizationS3BucketTableRowWithRelations =
  & Omit<OrganizationS3BucketTableRow, 'bucketId' | 'organizationId'>
  & {
    bucket: OrganizationS3InnerBucketRelation;
    organization: TableRowWithIdName;
  };
