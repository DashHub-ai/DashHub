import { pipe } from 'fp-ts/lib/function';

import { formatDate, tapTaskEither } from '@llm/commons';
import { type SdkSearchOrganizationItemT, useSdkForLoggedIn } from '@llm/sdk';
import { EllipsisCrudDropdownButton } from '~/components';

type Props = {
  item: SdkSearchOrganizationItemT;
  onAfterArchive: VoidFunction;
};

export function OrganizationsTableRow({ item, onAfterArchive }: Props) {
  const { sdks } = useSdkForLoggedIn();

  return (
    <tr>
      <td>{item.id}</td>
      <td>{item.name}</td>
      <td>{formatDate(item.createdAt)}</td>
      <td>{formatDate(item.updatedAt)}</td>
      <td>
        <EllipsisCrudDropdownButton
          onEdit={() => {}}
          onArchive={
            pipe(
              sdks.dashboard.organizations.archive(item.id),
              tapTaskEither(onAfterArchive),
            )
          }
        />
      </td>
    </tr>
  );
}
