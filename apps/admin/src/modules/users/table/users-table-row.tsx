import { pipe } from 'fp-ts/lib/function';
import { KeyRoundIcon, MailIcon } from 'lucide-react';
import { Link } from 'wouter';

import { formatDate, tapTaskEither, tapTaskOption } from '@llm/commons';
import { type SdkSearchUserItemT, useSdkForLoggedIn } from '@llm/sdk';
import { ArchivedBadge, BooleanBadge, EllipsisCrudDropdownButton } from '@llm/ui';
import { useI18n } from '~/i18n';
import { useSitemap } from '~/routes';

import { useUserUpdateModal } from '../form';

type Props = {
  item: SdkSearchUserItemT;
  onUpdated: VoidFunction;
};

export function UsersTableRow({ item, onUpdated }: Props) {
  const sitemap = useSitemap();
  const { pack } = useI18n();
  const { sdks } = useSdkForLoggedIn();
  const { auth } = item;

  const updateModal = useUserUpdateModal();

  return (
    <tr>
      <td>{item.id}</td>
      <td>{item.email}</td>
      <td>
        {(
          item.role === 'user'
            ? (
                <Link
                  className="uk-link"
                  href={sitemap.organizations.show(item.organization.id)}
                >
                  {item.organization.name}
                </Link>
              )
            : '-'
        )}
      </td>
      <td>
        <BooleanBadge value={item.active} />
      </td>
      <td>
        <div className="uk-flex space-x-1.5">
          {auth.email?.enabled && (
            <span className="uk-badge uk-badge-secondary" title={pack.common.email}>
              <MailIcon size={16} />
            </span>
          )}

          {auth.password?.enabled && (
            <span className="uk-badge uk-badge-secondary" title={pack.common.password}>
              <KeyRoundIcon size={16} />
            </span>
          )}
        </div>
      </td>
      <td><ArchivedBadge archived={item.archived} /></td>
      <td>{formatDate(item.createdAt)}</td>
      <td>{formatDate(item.updatedAt)}</td>
      <td>
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
      </td>
    </tr>
  );
}
