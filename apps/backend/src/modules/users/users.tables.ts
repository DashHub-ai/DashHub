import type { ColumnType } from 'kysely';

import type {
  SdkEnabledUserAuthMethodsT,
  SdkOrganizationUserRoleT,
  SdkUserRoleT,
} from '@llm/sdk';
import type {
  NormalizeSelectTableRow,
  TableRowWithIdName,
  TableWithArchivedAtColumn,
  TableWithArchiveProtectionColumn,
  TableWithDefaultColumns,
} from '~/modules/database';

export type UsersTable = TableWithDefaultColumns &
  TableWithArchivedAtColumn &
  TableWithArchiveProtectionColumn & {
    jwt_refresh_token: ColumnType<string, never>;
    active: boolean;
    last_login_at: Date | null;
    name: string;
    email: string;
    role: SdkUserRoleT;
  };

export type UserTableRowOrganizationRelation = TableRowWithIdName & {
  role: SdkOrganizationUserRoleT;
};

export type UserTableRowWithRelations = NormalizeSelectTableRow<UsersTable>
  & {
    auth: SdkEnabledUserAuthMethodsT;
  }
  & (
    | { role: 'root'; organization: null; }
    | { role: 'user'; organization: UserTableRowOrganizationRelation; }
  );

export type UserTableRowBaseRelation = Pick<UserTableRowWithRelations, 'id' | 'name' | 'email'>;
