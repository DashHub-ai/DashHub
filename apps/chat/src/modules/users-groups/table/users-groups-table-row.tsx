import { pipe } from 'fp-ts/lib/function';

import { formatDate, tapTaskEither, tapTaskOption } from '@llm/commons';
import { type SdkSearchUsersGroupItemT, useSdkForLoggedIn } from '@llm/sdk';
import { ArchivedBadge, EllipsisCrudDropdownButton } from '@llm/ui';

import { useUsersGroupUpdateModal } from '../form';

type Props = {
  item: SdkSearchUsersGroupItemT;
  onUpdated: VoidFunction;
};

export function UsersGroupTableRow({ item, onUpdated }: Props) {
  const { sdks } = useSdkForLoggedIn();
  const updateModal = useUsersGroupUpdateModal();

  return (
    <tr>
      <td>{item.id}</td>
      <td>{item.name}</td>
      <td>{item.users.length}</td>
      <td><ArchivedBadge archived={item.archived} /></td>
      <td>{formatDate(item.updatedAt)}</td>
      <td>{formatDate(item.createdAt)}</td>
      <td>
        <EllipsisCrudDropdownButton
          {...!item.archived && {
            onUpdate: pipe(
              updateModal.showAsOptional({
                usersGroup: item,
              }),
              tapTaskOption(onUpdated),
            ),
            onArchive: pipe(
              sdks.dashboard.users.archive(item.id),
              tapTaskEither(onUpdated),
            ),
          }}
          {...item.archived && {
            onUnarchive: pipe(
              sdks.dashboard.usersGroups.unarchive(item.id),
              tapTaskEither(onUpdated),
            ),
          }}
        />
      </td>
    </tr>
  );
}
