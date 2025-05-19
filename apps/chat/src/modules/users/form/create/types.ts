import type { SdkCreateUserInputT, SdkCreateUserOrganizationInputT } from '@dashhub/sdk';
import type { SelectItem } from '~/ui';

export type CreateUserOrganizationValue = SdkCreateUserOrganizationInputT & {
  item: SelectItem;
};

export type CreateUserFormValue =
  Extract<SdkCreateUserInputT, { role: 'root'; }> |
  Extract<SdkCreateUserInputT, { role: 'user'; }> & {
    organization: CreateUserOrganizationValue;
  };
