import type { SdkSearchUserItemT } from '@llm/sdk';

import { formatDate } from '@llm/commons';

type Props = {
  item: SdkSearchUserItemT;
};

export function UsersTableRow({ item }: Props) {
  return (
    <tr>
      <td>{item.id}</td>
      <td>{item.email}</td>
      <td>{formatDate(item.createdAt)}</td>
      <td>{formatDate(item.updatedAt)}</td>
      <td />
    </tr>
  );
}
