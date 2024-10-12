import type {
  NormalizeSelectTableRow,
  TableId,
  TableWithArchivedAtColumn,
  TableWithDefaultColumns,
} from '../database';

export type S3ResourcesBucketsTable = TableWithDefaultColumns &
  TableWithArchivedAtColumn & {
    name: string;
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
  };

export type S3ResourceType = 'other' | 'image';

export type S3ResourcesTable = TableWithDefaultColumns & {
  name: string;
  bucketId: TableId;
  s3Key: string;
  type: S3ResourceType;
};

export type S3ResourceImageSize = 'sm' | 'md' | 'lg';

export type S3ResourcesImagesTable = TableWithDefaultColumns &
  Record<`${S3ResourceImageSize}_width`, number> & {
    resourceId: TableId;
    width: number;
    height: number;
  };

export type S3ResourcesBucketTableRow = NormalizeSelectTableRow<S3ResourcesBucketsTable>;
