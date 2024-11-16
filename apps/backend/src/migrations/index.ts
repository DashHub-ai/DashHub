import * as addUsersTables from './0000-add-users-tables';
import * as addAuthTables from './0001-add-auth-tables';
import * as addOrganizationsTable from './0002-add-organizations-table';
import * as addS3OrganizationsBucketsTable from './0003-add-s3-resources-buckets-tables';
import * as addProjectsTable from './0004-add-projects-table';
import * as addAppsTable from './0005-add-apps-table';
import * as addDescriptionToProjects from './0006-add-description-to-projects-table';
import * as addDescriptionToApps from './0007-add-description-to-apps-table';
import * as addAiModelsTable from './0008-add-ai-models-tables';
import * as addChatsTables from './0009-add-chats-tables';
import * as fixUniqIndexInS3Buckets from './0010-fix-uniq-index-in-s3-buckets';

export const DB_MIGRATIONS = {
  '0000-add-users-tables': addUsersTables,
  '0001-add-auth-tables': addAuthTables,
  '0002-add-organizations-table': addOrganizationsTable,
  '0003-add-s3-resources-buckets-tables': addS3OrganizationsBucketsTable,
  '0004-add-projects-table': addProjectsTable,
  '0005-add-apps-table': addAppsTable,
  '0006-add-description-to-projects-table': addDescriptionToProjects,
  '0007-add-description-to-apps-table': addDescriptionToApps,
  '0008-add-ai-models-table': addAiModelsTable,
  '0009-add-chats-tables': addChatsTables,
  '0010-fix-uniq-index-in-s3-buckets': fixUniqIndexInS3Buckets,
};
