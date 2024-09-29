import type { SdkOrganizationT } from '@llm/sdk';

type Props = {
  item: SdkOrganizationT;
};

export function OrganizationsTableRow({ item }: Props) {
  return (
    <tr>
      <td>
        {item.name}
      </td>
    </tr>
  );
}
