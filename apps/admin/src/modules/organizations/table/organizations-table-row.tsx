import * as TE from 'fp-ts/lib/TaskEither';

import type { SdkSearchOrganizationItemT } from '@llm/sdk';

import { formatDate } from '@llm/commons';
import { EllipsisCrudDropdownButton } from '~/components';

type Props = {
  item: SdkSearchOrganizationItemT;
};

export function OrganizationsTableRow({ item }: Props) {
  return (
    <tr>
      <td>{item.id}</td>
      <td>{item.name}</td>
      <td>{formatDate(item.createdAt)}</td>
      <td>{formatDate(item.updatedAt)}</td>
      <td>
        <EllipsisCrudDropdownButton
          onEdit={() => {}}
          onArchive={TE.fromIO(() => {
            // eslint-disable-next-line no-console
            console.info('Archive!');
          })}
        />
      </td>
    </tr>
  );
}
