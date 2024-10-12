import type {
  SdkDecodeTokenFormatError,
  SdkEndpointNotFoundError,
  SdkIncorrectUsernameOrPasswordError,
  SdkInvalidJwtTokenError,
  SdkInvalidRequestError,
  SdkNoTokensInStorageError,
  SdkOrganizationUserRoleT,
  SdkPayloadValidationError,
  SdkRecordAlreadyExistsError,
  SdkRecordNotFoundError,
  SdkRequestError,
  SdkServerError,
  SdkUnauthorizedError,
  SdkUserRoleT,
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
  | SdkEndpointNotFoundError
  | SdkInvalidRequestError;

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

const I18N_USER_ROLES_EN: Record<SdkUserRoleT, string> = {
  root: 'Root',
  user: 'User',
};

const I18N_USER_ORGANIZATION_ROLES_EN: Record<SdkOrganizationUserRoleT, string> = {
  owner: 'Owner',
  member: 'Member',
};

export const I18N_PACK_EN = {
  common: {
    email: 'Email',
    password: 'Password',
  },
  validation: {
    required: 'This field is required',
    invalidEmail: 'This field must be an email address',
    mustBeLargerThan: 'This field must be larger than %{number}',
    password: {
      mustBeLongerThan: 'Password must be longer than %{number} characters',
    },
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
    unarchive: 'Unarchive',
    update: 'Update',
    add: 'Add',
    confirm: 'Confirm',
    resetFilters: 'Reset filters',
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
  tabs: {
    archiveFilters: {
      all: 'All',
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
    unarchiveConfirm: {
      title: 'Unarchive',
      message: {
        single: 'Are you sure you want to unarchive this item?',
        multiple: 'Do you really want to unarchive these %{count} items?',
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
      archived: 'Archived',
      active: 'Active',
      auth: 'Authentication',
      organization: 'Organization',
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
      s3Buckets: 'S3',
      projects: 'Projects',
      apps: 'Apps',
    },
    loggedIn: {
      logout: 'Logout',
    },
  },
  placeholders: {
    selectItem: 'Select item',
    noItemsFound: 'No items found',
    search: 'Search...',
  },
  modules: {
    organizations: {
      prefix: {
        organization: 'Organization',
      },
      userRoles: I18N_USER_ORGANIZATION_ROLES_EN,
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
    projects: {
      prefix: {
        project: 'Project',
      },
      form: {
        title: {
          create: 'Create project',
          edit: 'Edit project',
        },
        fields: {
          name: {
            label: 'Name',
            placeholder: 'Enter project name',
          },
          organization: {
            label: 'Organization',
          },
        },
      },
    },
    apps: {
      prefix: {
        app: 'App',
      },
      form: {
        title: {
          create: 'Create app',
          edit: 'Edit app',
        },
        fields: {
          name: {
            label: 'Name',
            placeholder: 'Enter app name',
          },
          organization: {
            label: 'Organization',
          },
          chatContext: {
            label: 'Chat context',
            placeholder: 'Enter chat context',
          },
        },
      },
    },
    s3Buckets: {
      prefix: {
        s3Bucket: 'S3 Bucket',
      },
      table: {
        columns: {
          accessKeyId: 'Access key',
        },
      },
      form: {
        title: {
          create: 'Create S3 bucket',
          edit: 'Edit S3 bucket',
        },
        fields: {
          name: {
            label: 'Name',
            placeholder: 'Enter S3 bucket name',
          },
          organization: {
            label: 'Organization',
          },
          region: {
            label: 'Region',
            placeholder: 'Enter region',
          },
          accessKeyId: {
            label: 'Access key',
            placeholder: 'Enter access key',
          },
          secretAccessKey: {
            label: 'Secret access key',
            placeholder: 'Enter secret access key',
          },
          default: {
            label: 'Default',
          },
        },
      },
    },
    users: {
      roles: I18N_USER_ROLES_EN,
      form: {
        title: {
          create: 'Create user',
          edit: 'Edit user',
        },
        fields: {
          role: {
            label: 'Role',
          },
          email: {
            label: 'E-Mail',
            placeholder: 'Enter e-mail address',
          },
          flags: {
            label: 'Flags',
          },
          active: {
            label: 'Active',
          },
          archiveProtection: {
            label: 'Archive protection',
          },
          organization: {
            choose: {
              label: 'Organization',
            },
            role: {
              label: 'Role in organization',
            },
          },
          auth: {
            label: 'Authentication',
            email: {
              label: 'Email',
              placeholder: 'Enter email address',
            },
            password: {
              label: 'Password',
              placeholder: 'Enter password',
            },
            resetPassword: {
              label: 'Reset password',
            },
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
    projects: {
      meta: {
        title: 'Projects',
        description: 'Manage projects',
      },
      title: 'Manage projects',
    },
    apps: {
      meta: {
        title: 'Apps',
        description: 'Manage apps',
      },
      title: 'Manage apps',
    },
    users: {
      meta: {
        title: 'Users',
        description: 'Manage users',
      },
      title: 'Manage users',
    },
    s3Buckets: {
      meta: {
        title: 'S3 Buckets',
        description: 'Manage S3 buckets',
      },
      title: 'Manage S3 buckets',
    },
  },
};
