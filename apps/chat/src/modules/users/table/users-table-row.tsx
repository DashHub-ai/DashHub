import type { ReactNode } from 'react';

import { pipe } from 'fp-ts/lib/function';
import { KeyRoundIcon, MailIcon } from 'lucide-react';

import { formatDate, tapTaskEither, tapTaskOption } from '@llm/commons';
import { type SdkSearchUserItemT, useSdkForLoggedIn } from '@llm/sdk';
import { useI18n } from '~/i18n';
import { OrganizationUserRoleBadge } from '~/modules/organizations';
import { ArchivedBadge, BooleanBadge, EllipsisCrudDropdownButton } from '~/ui';

import { useUserUpdateModal } from '../form';

export type UsersTableRowProps = {
  item: SdkSearchUserItemT;
  ctaButton?: ReactNode;
  onUpdated: VoidFunction;
};

export function UsersTableRow({ item, ctaButton, onUpdated }: UsersTableRowProps) {
  const { pack } = useI18n();
  const t = pack.users;

  const { sdks } = useSdkForLoggedIn();
  const { auth } = item;

  const updateModal = useUserUpdateModal();

  if (item.role !== 'user') {
    return null;
  }

  return (
    <tr>
      <td>{item.id}</td>
      <td>{item.email}</td>
      <td><OrganizationUserRoleBadge value={item.organization.role} /></td>
      <td>
        <BooleanBadge value={item.active} />
      </td>
      <td>
        <div className="uk-flex space-x-1.5">
          {auth.email?.enabled && (
            <span className="uk-badge uk-badge-secondary" title={t.row.authMethod.email}>
              <MailIcon size={16} />
            </span>
          )}

          {auth.password?.enabled && (
            <span className="uk-badge uk-badge-secondary" title={t.row.authMethod.password}>
              <KeyRoundIcon size={16} />
            </span>
          )}
        </div>
      </td>
      <td><ArchivedBadge archived={item.archived} /></td>
      <td>{formatDate(item.updatedAt)}</td>
      <td>
        {ctaButton || (
          <EllipsisCrudDropdownButton
            {...!item.archived && {
              onUpdate: pipe(
                updateModal.showAsOptional({
                  user: item,
                }),
                tapTaskOption(onUpdated),
              ),
              ...!item.archiveProtection && {
                onArchive: pipe(
                  sdks.dashboard.users.archive(item.id),
                  tapTaskEither(onUpdated),
                ),
              },
            }}
            {...item.archived && {
              onUnarchive: pipe(
                sdks.dashboard.users.unarchive(item.id),
                tapTaskEither(onUpdated),
              ),
            }}
          />
        )}
      </td>
    </tr>
  );
}
