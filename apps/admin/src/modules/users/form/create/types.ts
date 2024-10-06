import type { SdkCreateUserInputT, SdkCreateUserOrganizationInputT } from '@llm/sdk';
import type { SelectItem } from '~/components';

export type CreateUserOrganizationValue = SdkCreateUserOrganizationInputT & {
  item: SelectItem;
};

export type CreateUserFormValue =
  Extract<SdkCreateUserInputT, { role: 'root'; }> |
  Extract<SdkCreateUserInputT, { role: 'user'; }> & {
    organization: CreateUserOrganizationValue;
  };
