import * as addUsersTables from './0000-add-users-tables';
import * as addAuthTables from './0001-add-auth-tables';
import * as addOrganizationsTable from './0002-add-organizations-table';
import * as addS3OrganizationsBucketsTable from './0003-add-s3-resources-buckets-tables';

export const DB_MIGRATIONS = {
  '0000-add-users-tables': addUsersTables,
  '0001-add-auth-tables': addAuthTables,
  '0002-add-organizations-table': addOrganizationsTable,
  '0003-add-s3-resources-buckets-tables': addS3OrganizationsBucketsTable,
};
