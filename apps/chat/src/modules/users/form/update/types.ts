import type {
  SdkTableRowWithIdT,
  SdkUpdateUserInputT,
} from '@dashhub/sdk';

export type UpdateUserFormValue =
  SdkTableRowWithIdT &
  SdkUpdateUserInputT;
