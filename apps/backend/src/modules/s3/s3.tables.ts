import type {
  NormalizeSelectTableRow,
  TableId,
  TableWithArchivedAtColumn,
  TableWithDefaultColumns,
} from '../database';

export type S3ResourcesBucketsTable =
  & TableWithDefaultColumns
  & TableWithArchivedAtColumn
  & {
    name: string;
    ssl: boolean;
    port: number;
    endpoint: string;
    public_base_url: string;
    region: string;
    access_key_id: string;
    secret_access_key: string;
    bucket_name: string;
  };

export type S3ResourceType = 'other' | 'image';

export type S3ResourcesTable =
  & TableWithDefaultColumns
  & {
    name: string;
    bucket_id: TableId;
    s3_key: string;
    type: S3ResourceType;
  };

export type S3ResourceImageSize = 'sm' | 'md' | 'lg';

export type S3ResourcesImagesTable =
  & TableWithDefaultColumns
  & Record<`${S3ResourceImageSize}_width`, number>
  & {
    resource_id: TableId;
    width: number;
    height: number;
  };

export type S3ResourcesBucketTableRow = NormalizeSelectTableRow<S3ResourcesBucketsTable>;
