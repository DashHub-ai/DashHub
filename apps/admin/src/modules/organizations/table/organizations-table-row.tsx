import type { SdkOrganizationT } from '@llm/sdk';

import { formatDate } from '@llm/commons';

type Props = {
  item: SdkOrganizationT;
};

export function OrganizationsTableRow({ item }: Props) {
  return (
    <tr>
      <td>{item.name}</td>
      <td>{formatDate(item.createdAt)}</td>
      <td>{formatDate(item.updatedAt)}</td>
      <td />
    </tr>
  );
}
