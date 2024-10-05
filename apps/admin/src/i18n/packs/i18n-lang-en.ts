import type {
  SdkDecodeTokenFormatError,
  SdkEndpointNotFoundError,
  SdkIncorrectUsernameOrPasswordError,
  SdkInvalidJwtTokenError,
  SdkNoTokensInStorageError,
  SdkPayloadValidationError,
  SdkRecordAlreadyExistsError,
  SdkRecordNotFoundError,
  SdkRequestError,
  SdkServerError,
  SdkUnauthorizedError,
} from '@llm/sdk';

export type SdkTranslatedErrors =
  | SdkIncorrectUsernameOrPasswordError
  | SdkDecodeTokenFormatError
  | SdkNoTokensInStorageError
  | SdkPayloadValidationError
  | SdkRequestError
  | SdkServerError
  | SdkUnauthorizedError
  | SdkInvalidJwtTokenError
  | SdkRecordAlreadyExistsError
  | SdkRecordNotFoundError
  | SdkEndpointNotFoundError;

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
};

export const I18N_PACK_EN = {
  validation: {
    required: 'This field is required',
    invalidEmail: 'This field must be an email address',
    mustBeLargerThan: 'This field must be larger than %{number}',
  },
  errors: {
    tagged: I18N_SDK_ERRORS_EN,
  },
  buttons: {
    create: 'Create',
    cancel: 'Cancel',
    close: 'Close',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    archive: 'Archive',
    update: 'Update',
    add: 'Add',
    confirm: 'Confirm',
  },
  tabs: {
    archiveFilters: {
      active: 'Active',
      archived: 'Archived',
    },
  },
  notifications: {
    save: {
      success: 'Saved successfully',
      error: 'An error occurred while saving',
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
  table: {
    columns: {
      id: 'ID',
      name: 'Name',
      email: 'E-Mail',
      createdAt: 'Created at',
      updatedAt: 'Updated at',
      actions: 'Actions',
    },
  },
  navigation: {
    links: {
      home: 'Overview',
      organizations: 'Organizations',
      users: 'Users',
      s3: 'S3',
    },
    loggedIn: {
      logout: 'Logout',
    },
  },
  placeholders: {
    noItemsFound: 'No items found',
  },
  modules: {
    organizations: {
      form: {
        title: {
          create: 'Create organization',
          edit: 'Edit organization',
        },
        fields: {
          name: {
            label: 'Name',
            placeholder: 'Enter organization name',
          },
          maxNumberOfUsers: {
            label: 'Max number of users',
            placeholder: 'Enter max number of users',
          },
        },
      },
    },
  },
  routes: {
    shared: {
      meta: {
        title: 'DashHub Admin',
      },
    },
    login: {
      meta: {
        title: 'Login',
        description: 'Login to your account',
      },
      emailStep: {
        title: 'Login',
        description: 'Enter your email below to login to your account',
        email: 'Email address',
      },
      passwordStep: {
        title: 'Login',
        description: 'Enter your password below to login to your account',
        email: 'Email address',
        password: 'Password',
        remember: 'Remember me',
      },
      orContinueWith: 'Or continue with',
      cta: {
        loginUsingEmail: 'Login using Email',
        loginUsingPassword: 'Login using Password',
      },
      terms: {
        phrase: 'By clicking continue, you agree to our %{terms} and %{privacy}.',
        terms: 'Terms of Service',
        privacy: 'Privacy Policy',
      },
    },
    home: {
      meta: {
        title: 'Overview',
        description: 'Overview of your account',
      },
      title: 'Summary',
    },
    organizations: {
      meta: {
        title: 'Organizations',
        description: 'Manage organizations',
      },
      title: 'Manage organizations',
    },
    users: {
      meta: {
        title: 'Users',
        description: 'Manage users',
      },
      title: 'Manage users',
    },
    s3: {
      meta: {
        title: 'S3 Buckets',
        description: 'Manage S3 buckets',
      },
      title: 'Manage S3 buckets',
    },
  },
};
