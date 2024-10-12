import type {
  NormalizeSelectTableRow,
  TableId,
  TableRowWithIdName,
} from '~/modules/database';
import type { S3ResourcesBucketTableRow } from '~/modules/s3';

export type OrganizationsS3BucketsTable = {
  bucket_id: TableId;
  organization_id: TableId;
  default: boolean;
};

export type OrganizationS3BucketTableRow = NormalizeSelectTableRow<OrganizationsS3BucketsTable>;

export type OrganizationS3BucketTableRowWithRelations =
  & Omit<OrganizationS3BucketTableRow, 'bucketId' | 'organizationId'>
  & {
    bucket: S3ResourcesBucketTableRow;
    organization: TableRowWithIdName;
  };
