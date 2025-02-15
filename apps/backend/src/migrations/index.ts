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
import * as addProjectsFilesTable from './0020-add-projects-files-table';
import * as dropUniqueNameFromS3Assets from './0021-drop-unique-name-from-s3-assets';
import * as addIdToProjectFilesTable from './0022-add-id-to-project-files-table';
import * as addProjectsEmbeddingsTable from './0023-add-projects-embeddings-table';
import * as dropUnusedImagesTable from './0024-drop-unused-images-table';
import * as addInternalProjectsFields from './0025-add-internal-projects-fields';
import * as addUsersGroupTable from './0026-add-users-groups-table';
import * as addProjectsPoliciesTable from './0027-add-projects-policies';
import * as addProjectsSummaries from './0028-add-projects-summarizes';
import * as dropProjectPolicies from './0029-drop-project-policies';
import * as addPermissionsTable from './0030-add-permissions-table';
import * as dropPublicFlagInChats from './0031-drop-public-flag-in-chats';
import * as addTechUsersToOrganizationRoles from './0032-add-tech-users-to-organization-roles';
import * as addNameToUsers from './0033-add-name-to-users';
import * as addLogoToApps from './0034-add-logo-to-apps';
import * as addVisionFlatAIModels from './0035-add-vision-flag-to-ai-models';
import * as addProjectsToApps from './0036-add-projects-to-apps';
import * as addCorruptedFlagToMessages from './0037-add-corrupted-flag-to-messages';
import * as addAIModelToApps from './0038-add-ai-model-to-apps';
import * as addPromotionToApps from './0039-add-promotion-to-apps';
import * as addUsersAvatars from './0040-add-users-avatars';
import * as addUsersAISettings from './0041-add-users-ai-settings-table';
import * as addSearchEnginesTable from './0042-add-search-engines-table';

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
  '0020-add-projects-files-table': addProjectsFilesTable,
  '0021-drop-unique-name-from-s3-assets': dropUniqueNameFromS3Assets,
  '0022-add-id-to-project-files-table': addIdToProjectFilesTable,
  '0023-add-projects-embeddings-table': addProjectsEmbeddingsTable,
  '0024-drop-unused-images-table': dropUnusedImagesTable,
  '0025-add-internal-projects-fields': addInternalProjectsFields,
  '0026-add-users-groups-table': addUsersGroupTable,
  '0027-add-projects-policies': addProjectsPoliciesTable,
  '0028-add-projects-summarizes': addProjectsSummaries,
  '0029-drop-project-policies': dropProjectPolicies,
  '0030-add-permissions-table': addPermissionsTable,
  '0031-drop-public-flag-in-chats': dropPublicFlagInChats,
  '0032-add-tech-users-to-organization-roles': addTechUsersToOrganizationRoles,
  '0033-add-name-to-users': addNameToUsers,
  '0034-add-logo-to-apps': addLogoToApps,
  '0035-add-vision-flag-to-ai-models': addVisionFlatAIModels,
  '0036-add-projects-to-apps': addProjectsToApps,
  '0037-add-corrupted-flag-to-messages': addCorruptedFlagToMessages,
  '0038-add-ai-model-to-apps': addAIModelToApps,
  '0039-add-promotion-to-apps': addPromotionToApps,
  '0040-add-users-avatars': addUsersAvatars,
  '0041-add-users-ai-settings-table': addUsersAISettings,
  '0042-add-search-engines-table': addSearchEnginesTable,
};
