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
import * as addNameToChatSummary from './0011-add-name-to-chat-summary';
import * as addCreatorToMessagesTable from './0012-add-creator-to-messages-table';
import * as addRepliedMessageId from './0013-add-replied-message-id';
import * as addLastSummarizedMessage from './0014-add-last-summarized-message';
import * as addAttachedAppIdToMessages from './0015-add-attached-app-id-to-messages';
import * as addAppsCategories from './0016-add-apps-categories';
import * as addInternalFlagToChats from './0017-add-internal-flag-to-chats';
import * as addProjectsToChats from './0018-add-projects-to-chats';
import * as extendResourcesBucketTable from './0019-extend-resources-bucket-table';

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
  '0011-add-name-to-chat-summary': addNameToChatSummary,
  '0012-add-creator-to-messages-table': addCreatorToMessagesTable,
  '0013-add-replied-message-id': addRepliedMessageId,
  '0014-add-last-summarized-message': addLastSummarizedMessage,
  '0015-add-attached-app-id-to-messages': addAttachedAppIdToMessages,
  '0016-add-apps-categories': addAppsCategories,
  '0017-add-internal-flag-to-chats': addInternalFlagToChats,
  '0018-add-projects-to-chats': addProjectsToChats,
  '0019-extend-resources-bucket-table': extendResourcesBucketTable,
};
