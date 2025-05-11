import type { ColumnType } from 'kysely';

import type {
  SdkEnabledUserAuthMethodsT,
  SdkOrganizationUserRoleT,
  SdkUserRoleT,
} from '@dashhub/sdk';
import type {
  NormalizeSelectTableRow,
  TableId,
  TableRowWithIdName,
  TableWithArchivedAtColumn,
  TableWithArchiveProtectionColumn,
  TableWithDefaultColumns,
} from '~/modules/database';

import type { S3ResourcesTableRowWithRelations } from '../s3';
import type { UsersAISettingsTableRelationRow } from '../users-ai-settings';

export type UsersTable = TableWithDefaultColumns &
  TableWithArchivedAtColumn &
  TableWithArchiveProtectionColumn & {
    jwt_refresh_token: ColumnType<string, never>;
    active: boolean;
    last_login_at: Date | null;
    name: string;
    email: string;
    role: SdkUserRoleT;
    avatar_s3_resource_id: TableId | null;
  };

export type UserTableRowOrganizationRelation = TableRowWithIdName & {
  role: SdkOrganizationUserRoleT;
};

export type UserTableRowWithRelations = Omit<NormalizeSelectTableRow<UsersTable>, 'avatarS3ResourceId'>
  & {
    auth: SdkEnabledUserAuthMethodsT;
    avatar: S3ResourcesTableRowWithRelations | null;
    aiSettings: UsersAISettingsTableRelationRow;
  }
  & (
    | { role: 'root'; organization: null; }
    | { role: 'user'; organization: UserTableRowOrganizationRelation; }
  );

export type UserTableRowBaseRelation = Pick<UserTableRowWithRelations, 'id' | 'name' | 'email'>;
