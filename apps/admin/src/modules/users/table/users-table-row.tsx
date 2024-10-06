import { pipe } from 'fp-ts/lib/function';

import { formatDate, tapTaskEither } from '@llm/commons';
import { type SdkSearchUserItemT, useSdkForLoggedIn } from '@llm/sdk';
import { EllipsisCrudDropdownButton } from '~/components';

type Props = {
  item: SdkSearchUserItemT;
  onUpdated: VoidFunction;
};

export function UsersTableRow({ item, onUpdated }: Props) {
  const { sdks } = useSdkForLoggedIn();

  return (
    <tr>
      <td>{item.id}</td>
      <td>{item.email}</td>
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
