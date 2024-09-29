import type { SdkSearchOrganizationItemT } from '@llm/sdk';

import { formatDate } from '@llm/commons';

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
      <td />
    </tr>
  );
}
