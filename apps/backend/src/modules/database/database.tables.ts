import type { RecordOfType } from '@dashhub/commons';
import type { CommercialDatabase } from '~/commercial';

import type { AIExternalAPIsTable } from '../ai-external-apis';
import type { AIModelsTable } from '../ai-models';
import type { AppsTable } from '../apps';
import type { AppsCategoriesTable } from '../apps-categories';
import type {
  AuthEmailsTable,
  AuthPasswordsTable,
  AuthResetPasswordsTable,
} from '../auth';
import type {
  ChatsTable,
} from '../chats';
import type { ChatSummariesTable } from '../chats-summaries';
import type { MessagesTable } from '../messages';
import type {
  OrganizationsS3BucketsTable,
  OrganizationsTable,
  OrganizationsUsersTable,
} from '../organizations';
import type { OrganizationsAISettingsTable } from '../organizations-ai-settings';
import type { PermissionsTable } from '../permissions';
import type { PinnedMessagesTable } from '../pinned-messages';
import type {
  ProjectsTable,
} from '../projects';
import type { ProjectsEmbeddingsTable } from '../projects-embeddings';
import type { ProjectsFilesTable } from '../projects-files';
import type { ProjectsSummariesTable } from '../projects-summaries';
import type {
  S3ResourcesBucketsTable,
  S3ResourcesTable,
} from '../s3';
import type { SearchEnginesTable } from '../search-engines';
import type { UsersTable } from '../users';
import type { UsersAISettingsTable } from '../users-ai-settings';
import type { UsersFavoritesTable } from '../users-favorites';
import type { UsersGroupsTable, UsersGroupsUsersTable } from '../users-groups';
import type {
  TableWithArchivedAtColumn,
  TableWithIdColumn,
  TableWithUuidColumn,
} from './types';

export type DatabaseTables =
  & {
    // S3
    s3_resources: S3ResourcesTable;
    s3_resources_buckets: S3ResourcesBucketsTable;

    // Users
    users: UsersTable;
    users_groups: UsersGroupsTable;
    users_groups_users: UsersGroupsUsersTable;
    users_ai_settings: UsersAISettingsTable;
    users_favorites: UsersFavoritesTable;

    // Auth
    auth_emails: AuthEmailsTable;
    auth_passwords: AuthPasswordsTable;
    auth_reset_passwords: AuthResetPasswordsTable;

    // Organizations
    organizations: OrganizationsTable;
    organizations_s3_resources_buckets: OrganizationsS3BucketsTable;
    organizations_users: OrganizationsUsersTable;
    organizations_ai_settings: OrganizationsAISettingsTable;

    // Projects
    projects: ProjectsTable;
    projects_files: ProjectsFilesTable;
    projects_embeddings: ProjectsEmbeddingsTable;
    projects_summaries: ProjectsSummariesTable;

    // Apps
    apps: AppsTable;
    apps_categories: AppsCategoriesTable;

    // Chats
    chats: ChatsTable;
    chat_summaries: ChatSummariesTable;
    messages: MessagesTable;
    pinned_messages: PinnedMessagesTable;

    // LLM
    ai_models: AIModelsTable;

    // Permissions
    permissions: PermissionsTable;

    // Search engines
    search_engines: SearchEnginesTable;

    // External APIs
    ai_external_apis: AIExternalAPIsTable;
  }
  & CommercialDatabase;

export type DatabaseTablesWithId = RecordOfType<DatabaseTables, TableWithIdColumn | TableWithUuidColumn>;

export type DatabaseTablesWithArchivedAt = RecordOfType<
  DatabaseTables,
  TableWithArchivedAtColumn
>;
