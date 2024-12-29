import type {
  SdkTableRowWithIdT,
  SdkUpdateUserInputT,
} from '@llm/sdk';

export type UpdateUserFormValue =
  SdkTableRowWithIdT &
  SdkUpdateUserInputT;
