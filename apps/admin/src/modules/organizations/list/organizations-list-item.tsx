import type { SdkOrganizationT } from '@llm/sdk';

type Props = {
  item: SdkOrganizationT;
};

export function OrganizationsListItem({ item }: Props) {
  return (
    <div>
      {item.name}
    </div>
  );
}
