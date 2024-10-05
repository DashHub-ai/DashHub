import { pipe } from 'fp-ts/lib/function';

import { formatDate, tapTaskEither, tapTaskOption } from '@llm/commons';
import { type SdkSearchOrganizationItemT, useSdkForLoggedIn } from '@llm/sdk';
import { ArchivedBadge, EllipsisCrudDropdownButton } from '~/components';

import { useOrganizationUpdateModal } from '../form/update';

type Props = {
  item: SdkSearchOrganizationItemT;
  onAfterArchive: VoidFunction;
  onAfterUpdate: VoidFunction;
};

export function OrganizationsTableRow({ item, onAfterArchive, onAfterUpdate }: Props) {
  const { sdks } = useSdkForLoggedIn();
  const updateModal = useOrganizationUpdateModal();

  return (
    <tr>
      <td>{item.id}</td>
      <td>{item.name}</td>
      <td><ArchivedBadge archived={item.archived} /></td>
      <td>{formatDate(item.createdAt)}</td>
      <td>{formatDate(item.updatedAt)}</td>
      <td>
        <EllipsisCrudDropdownButton
          {...!item.archived && {
            onUpdate: pipe(
              updateModal.showAsOptional({
                defaultValue: item,
              }),
              tapTaskOption(onAfterUpdate),
            ),
            onArchive: pipe(
              sdks.dashboard.organizations.archive(item.id),
              tapTaskEither(onAfterArchive),
            ),
          }}
          {...item.archived && {
            onUnarchive: pipe(
              sdks.dashboard.organizations.unarchive(item.id),
              tapTaskEither(onAfterArchive),
            ),
          }}
        />
      </td>
    </tr>
  );
}
