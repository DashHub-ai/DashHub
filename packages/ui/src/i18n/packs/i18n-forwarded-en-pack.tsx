import type { SdkTranslatedErrors } from '@llm/sdk';

const I18N_SDK_ERRORS_EN: Record<SdkTranslatedErrors['tag'], string> = {
  SdkIncorrectUsernameOrPasswordError: 'Incorrect email or password',
  SdkDecodeTokenFormatError: 'Token format is incorrect',
  SdkPayloadValidationError: 'Payload validation error',
  SdkRequestError: 'Request error',
  SdkServerError: 'Server error',
  SdkUnauthorizedError: 'Unauthorized',
  SdkInvalidJwtTokenError: 'Invalid or missing JWT token',
  SdkRecordAlreadyExistsError: 'Record already exists',
  SdkRecordNotFoundError: 'Record not found',
  SdkEndpointNotFoundError: 'Invalid API endpoint',
  SdkInvalidRequestError: 'Invalid request format',
};

export const I18N_FORWARDED_EN_PACK = {
  placeholders: {
    search: 'Search...',
    selectItem: 'Select item',
    noItemsFound: 'No items found',
  },
  tutorialBox: {
    gotIt: 'Rozumiem',
  },
  form: {
    alerts: {
      saveSuccess: 'Changes saved successfully!',
      saveError: 'Failed to save changes!',
    },
  },
  buttons: {
    create: 'Create',
    cancel: 'Cancel',
    open: 'Open',
    close: 'Close',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    archive: 'Archive',
    unarchive: 'Unarchive',
    update: 'Update',
    add: 'Add',
    confirm: 'Confirm',
    resetFilters: 'Reset filters',
  },
  errors: {
    tagged: I18N_SDK_ERRORS_EN,
  },
  validation: {
    required: 'This field is required',
    invalidEmail: 'This field must be an email address',
    mustBeLargerThan: 'This field must be larger than %{number}',
    password: {
      mustBeLongerThan: 'Password must be longer than %{number} characters',
    },
  },
  notifications: {
    save: {
      success: 'Saved successfully',
      error: 'An error occurred while saving',
    },
  },
  pagination: {
    itemsPerPage: 'Items per page',
    showNthToNthOf: 'Shown %{from} - %{to} of %{total}',
    pageNthOfTotal: 'Page %{page} of %{total}',
    searchPlaceholder: 'Enter search phrase...',
    goto: {
      firstPage: 'First page',
      previousPage: 'Previous page',
      nextPage: 'Next page',
      lastPage: 'Last page',
    },
  },
  badges: {
    archive: {
      archived: 'Archived',
      active: 'Active',
    },
    boolean: {
      yes: 'Yes',
      no: 'No',
    },
  },
  modals: {
    archiveConfirm: {
      title: 'Archive',
      message: {
        single: 'Are you sure you want to archive this item? This item may still be visible in assigned system locations after archiving.',
        multiple: 'Do you really want to archive these %{count} items? These items may still be visible in assigned system locations after archiving.',
      },
      yesIAmSure: 'Yes, I am sure',
    },
    unarchiveConfirm: {
      title: 'Unarchive',
      message: {
        single: 'Are you sure you want to unarchive this item?',
        multiple: 'Do you really want to unarchive these %{count} items?',
      },
      yesIAmSure: 'Yes, I am sure',
    },
  },
  tabs: {
    archiveFilters: {
      all: 'All',
      active: 'Active',
      archived: 'Archived',
    },
  },
};
