import type { RecordOfType } from '@llm/commons';

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
import type {
  ProjectsTable,
} from '../projects';
import type { ProjectsFilesTable } from '../projects-files';
import type {
  S3ResourcesBucketsTable,
  S3ResourcesImagesTable,
  S3ResourcesTable,
} from '../s3';
import type { UsersTable } from '../users';
import type {
  TableWithArchivedAtColumn,
  TableWithIdColumn,
  TableWithUuidColumn,
} from './types';

export type DatabaseTables = {
  // S3
  s3_resources: S3ResourcesTable;
  s3_resources_buckets: S3ResourcesBucketsTable;
  s3_resources_images: S3ResourcesImagesTable;

  // Users
  users: UsersTable;

  // Auth
  auth_emails: AuthEmailsTable;
  auth_passwords: AuthPasswordsTable;
  auth_reset_passwords: AuthResetPasswordsTable;

  // Organizations
  organizations: OrganizationsTable;
  organizations_s3_resources_buckets: OrganizationsS3BucketsTable;
  organizations_users: OrganizationsUsersTable;

  // Projects
  projects: ProjectsTable;
  projects_files: ProjectsFilesTable;

  // Apps
  apps: AppsTable;
  apps_categories: AppsCategoriesTable;

  // Chats
  chats: ChatsTable;
  chat_summaries: ChatSummariesTable;
  messages: MessagesTable;

  // LLM
  ai_models: AIModelsTable;
};

export type DatabaseTablesWithId = RecordOfType<DatabaseTables, TableWithIdColumn | TableWithUuidColumn>;

export type DatabaseTablesWithArchivedAt = RecordOfType<
  DatabaseTables,
  TableWithArchivedAtColumn
>;
