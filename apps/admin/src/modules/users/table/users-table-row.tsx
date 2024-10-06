import { pipe } from 'fp-ts/lib/function';

import { formatDate, tapTaskEither } from '@llm/commons';
import { type SdkSearchUserItemT, useSdkForLoggedIn } from '@llm/sdk';
import { ArchivedBadge, BooleanBadge, EllipsisCrudDropdownButton } from '~/components';
import { useI18n } from '~/i18n';
import { UkIcon } from '~/icons';

type Props = {
  item: SdkSearchUserItemT;
  onUpdated: VoidFunction;
};

export function UsersTableRow({ item, onUpdated }: Props) {
  const { pack } = useI18n();
  const { sdks } = useSdkForLoggedIn();
  const { auth } = item;

  return (
    <tr>
      <td>{item.id}</td>
      <td>{item.email}</td>
      <td>
        <BooleanBadge value={item.active} />
      </td>
      <td>
        <div className="uk-flex space-x-1.5">
          {auth.email?.enabled && (
            <span className="uk-badge uk-badge-secondary" title={pack.common.email}>
              <UkIcon icon="mail" />
            </span>
          )}

          {auth.password?.enabled && (
            <span className="uk-badge uk-badge-secondary" title={pack.common.password}>
              <UkIcon icon="key-round" />
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
            onArchive: pipe(
              sdks.dashboard.users.archive(item.id),
              tapTaskEither(onUpdated),
            ),
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
