import type { SdkOrganizationT } from '@llm/sdk';

import { BasicRecordsList } from '~/components';

import { OrganizationsListItem } from './organizations-list-item';

export function OrganizationsContainer() {
  return (
    <BasicRecordsList<SdkOrganizationT>
      items={[]}
    >
      {({ item }) => (
        <OrganizationsListItem key={item.id} item={item} />
      )}
    </BasicRecordsList>
  );
}
