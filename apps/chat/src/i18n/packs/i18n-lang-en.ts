import type {
  SdkAIProviderT,
  SdkOrganizationUserRoleT,
  SdkPermissionAccessLevelT,
  SdkTranslatedErrors,
} from '@llm/sdk';

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

const I18N_AI_PROVIDERS_EN: Record<SdkAIProviderT, string> = {
  openai: 'OpenAI',
  gemini: 'Gemini',
  deepseek: 'DeepSeek',
  other: 'Other',
};

const I18N_ACCESS_LEVELS_EN: Record<SdkPermissionAccessLevelT, string> = {
  read: 'Read-only',
  write: 'Read and write',
};

const I18N_USER_ORGANIZATION_ROLES_EN: Record<SdkOrganizationUserRoleT, string> = {
  owner: 'Owner',
  member: 'Member',
  tech: 'Tech',
};

export const I18N_PACK_EN = {
  placeholders: {
    search: 'Search...',
    selectItem: 'Select item',
    noItemsFound: 'No items found',
    noDescription: 'No description',
  },
  tutorialBox: {
    gotIt: 'Got it',
  },
  form: {
    clearFile: 'Clear file',
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
    download: 'Download',
    select: 'Select',
    selected: 'Selected',
    choose: 'Choose',
    expand: {
      more: 'More',
      less: 'Less',
    },
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
    deleteConfirm: {
      title: 'Delete',
      message: {
        single: 'Are you sure you want to delete this item?',
        multiple: 'Do you really want to delete these %{count} items?',
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
    favoriteFilters: {
      all: 'All',
      favorite: 'Favorite',
      rest: 'Rest',
    },
  },
  navigation: {
    links: {
      home: 'Chats',
      projects: 'Projects',
      apps: 'Assistants',
      experts: 'Experts',
      management: 'Management',
    },
    loggedIn: {
      logout: 'Logout',
      settings: 'Settings',
    },
    loggedAsRow: {
      rootUser: 'Logged in as root user',
      techUser: 'Logged in as tech user',
    },
    search: {
      placeholder: 'Search...',
      button: 'Search',
    },
    notifications: {
      title: 'Notifications',
      empty: 'No new notifications',
    },
  },
  breadcrumbs: {
    routes: {
      home: 'Home',
      apps: 'Assistants',
    },
  },
  table: {
    columns: {
      id: 'ID',
      name: 'Name',
      description: 'Description',
      email: 'E-Mail',
      archived: 'Archived',
      active: 'Active',
      auth: 'Authentication',
      organization: 'Organization',
      parentCategory: 'Parent category',
      createdAt: 'Created at',
      updatedAt: 'Updated at',
      actions: 'Actions',
      role: 'Role',
    },
  },
  routes: {
    shared: {
      meta: {
        title: 'DashHub Chat',
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
    apps: {
      meta: {
        title: 'Assistants',
        description: 'Manage assistants',
      },
      title: 'Assistants',
      tutorial: {
        title: 'What are DashHub Assistants?',
        tools: 'Specialized LLM-powered tools for email composition, data organization, and content transformation',
        modular: 'Modular and reusable applications to boost your productivity across projects',
      },
      buttons: {
        create: 'New assistant',
      },
    },
    editApp: {
      meta: {
        title: 'Edit Assistant',
        description: 'Edit assistant',
      },
      title: 'Edit Assistant',
    },
    createApp: {
      meta: {
        title: 'Create Assistant',
        description: 'Create assistant',
      },
      title: 'Create Assistant',
    },
    projects: {
      meta: {
        title: 'Projects',
        description: 'Manage projects',
      },
      title: 'Projects',
      buttons: {
        create: 'New project',
      },
      tutorial: {
        title: 'What are DashHub Projects?',
        spaces: 'Create customized workspaces with dedicated knowledge bases and tailored configurations',
        collaboration: 'Build together seamlessly - invite team members and collaborate in a shared environment',
        context: 'Preserve conversation history and maintain project context for continuous progress',
      },
    },
    project: {
      meta: {
        title: 'Project',
        description: 'Manage project',
      },
      hello: 'Hello, how can we help you?',
      title: 'Project',
      chats: 'Chats in project',
      files: 'Files in project',
    },
    experts: {
      meta: {
        title: 'Experts',
        description: 'Manage experts',
      },
      title: 'Experts',
      tutorial: {
        title: 'What are DashHub Experts?',
        custom: 'Specialized AI assistants designed for specific tasks and domains',
        organization: 'Deploy and manage AI experts across your entire organization',
        knowledge: 'Enhanced with project-specific knowledge for more accurate assistance',
      },
    },
    settings: {
      meta: {
        title: 'Settings',
        description: 'Manage settings',
      },
      title: 'Settings',
    },
    home: {
      meta: {
        title: 'Home',
        description: 'Home',
      },
      title: 'Chats',
      hello: 'Hello, how can we help you?',
      tutorial: {
        title: 'Welcome to DashHub Chat!',
        ai: 'Powerful AI assistant ready to help with your tasks and questions',
        knowledge: 'Access to extensive knowledge base and specialized tools',
        history: 'Track and continue your conversations seamlessly',
      },
    },
    chat: {
      meta: {
        title: 'Chat',
        description: 'Chat with AI',
      },
      title: 'Chat',
    },
    chooseOrganization: {
      meta: {
        title: 'Choose Organization',
        description: 'Choose organization',
      },
      title: 'Choose Organization',
      tutorial: {
        title: 'Organization Selection Required',
        select: 'Use the navigation dropdown to select your organization',
        dashboard: 'Organization must be selected to access dashboard features',
        rootOnly: 'This step is only required for root users - regular users are automatically assigned to their organization',
      },
      sections: {
        organizations: 'Organizations',
        users: 'Root users',
      },
    },
    management: {
      meta: {
        title: 'Management',
        description: 'Management',
      },
      title: 'Management',
      pages: {
        users: {
          title: 'Users',
        },
        usersGroups: {
          title: 'Users Groups',
        },
        aiModels: {
          title: 'AI Models',
        },
        s3Buckets: {
          title: 'S3 Buckets',
        },
      },
    },
  },
  workspace: {
    selectOrganization: 'Select organization',
    organization: 'Organization',
  },
  searchBar: {
    viewAll: 'View all',
    input: {
      placeholder: 'Search...',
    },
    groups: {
      messages: {
        header: 'Messages',
        itemSubTitle: 'Message',
      },
      chats: {
        header: 'Chats',
        itemSubTitle: 'Chat',
      },
      projects: {
        header: 'Projects',
        itemSubTitle: 'Project',
      },
      apps: {
        header: 'Assistants',
        itemSubTitle: 'Assistant',
      },
    },
  },
  chats: {
    start: {
      placeholder: 'Type your message here...',
      addFile: 'Add file',
      selectProject: 'Select project',
      publicChat: 'Public chat',
      privateChat: 'Private chat',
      start: 'Start chat',
      startOnEnter: 'Start chat on Enter',
      selectModel: 'AI Model',
    },
    history: {
      title: 'Your Chats',
      placeholder: 'No chats yet',
    },
  },
  chat: {
    title: 'Chat',
    archived: 'Chat is archived',
    card: {
      noTitle: 'Unnamed Chat',
      noDescription: 'No description',
      totalMessages: 'messages',
    },
    app: {
      attached: 'App attached',
    },
    messages: {
      empty: 'No messages yet',
      you: 'You',
      ai: 'AI',
    },
    generating: {
      title: 'Generating title...',
      description: 'Generating description...',
    },
    actions: {
      expand: {
        more: 'Show more',
        less: 'Show less',
      },
      send: 'Send',
      cancel: 'Cancel',
      submitOnEnter: 'Submit on Enter',
      attachFile: 'Attach file',
      refresh: 'Refresh response',
      reply: 'Reply to this message',
      addApp: 'Add app',
    },
    placeholders: {
      enterMessage: 'Enter your message...',
    },
    config: {
      title: 'Chat Configuration',
      name: 'Title of chat',
      namePlaceholder: 'Enter title...',
      description: 'Description of chat',
      descriptionPlaceholder: 'Enter description...',
      generated: 'Auto-generate',
      summary: 'Chat summary',
      tutorial: {
        title: 'Chat Configuration',
        help: {
          title: 'Title and description help you identify chats in your history',
          autoGenerate: 'With auto-generating chat summaries, you can save time and maintain consistency in history',
        },
      },
      archive: {
        title: 'Archive your chat',
        description: 'Archive your chat to keep your active chats organized. It\'s be moved to the archive section, where you can access it anytime.',
        button: 'Archive',
      },
      unarchive: {
        title: 'Unarchive your chat',
        description: 'Bring your chat back to active chats.',
        button: 'Unarchive',
      },
    },
  },
  prompts: {
    attachApp: [
      'Show me how to use this app',
      'What are the main features of this app?',
      'Give me some examples of what I can do with this app',
      'What are the best practices for using this app?',
    ],
  },
  apps: {
    favorites: {
      add: 'Add to favorites',
      remove: 'Remove from favorites',
    },
    grid: {
      placeholder: 'No assistants yet. Stay tuned!',
    },
    chooseAppModal: {
      title: 'Choose Assistant',
    },
  },
  appsCreator: {
    files: {
      title: 'Files',
    },
    create: {
      title: 'Create New Assistant',
    },
    edit: {
      title: 'Edit Assistant',
    },
    fields: {
      category: {
        label: 'Category',
      },
      permissions: {
        label: 'Permissions',
      },
      name: {
        label: 'Name',
        placeholder: 'Enter app name',
      },
      description: {
        label: 'Description',
        placeholder: 'Enter app description',
      },
      aiModel: {
        label: 'Preferred AI model',
      },
      logo: {
        label: 'Logo',
      },
      chatContext: {
        label: 'Chat prompt',
        placeholder: 'Enter app chat prompt description, it will help AI generate responses',
      },
    },
  },
  aiModels: {
    providers: I18N_AI_PROVIDERS_EN,
    prefix: {
      app: 'AI Model',
    },
    table: {
      columns: {
        defaultForOrganization: 'Default',
      },
    },
    form: {
      title: {
        create: 'Create AI model',
        edit: 'Edit AI model',
      },
      fields: {
        name: {
          label: 'Name',
          placeholder: 'Enter AI model name',
        },
        description: {
          label: 'Description',
          placeholder: 'Enter AI model description',
        },
        organization: {
          label: 'Organization',
        },
        provider: {
          label: 'AI provider',
        },
        credentials: {
          apiModel: {
            label: 'API model',
            placeholder: 'Enter API model',
          },
          apiKey: {
            label: 'API key',
            placeholder: 'Enter API key',
          },
          apiUrl: {
            label: 'API URL',
            placeholder: 'Enter API URL',
          },
        },
        settings: {
          label: 'Settings',
        },
        defaultForOrganization: {
          label: 'Default for organization',
        },
        embedding: {
          label: 'Embedding',
        },
        vision: {
          label: 'Vision',
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
        defaultForOrganization: 'Default',
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
        settings: {
          label: 'Settings',
        },
        defaultForOrganization: {
          label: 'Default for organization',
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
        ssl: {
          label: 'SSL',
        },
        endpoint: {
          label: 'Endpoint',
          placeholder: 'Enter endpoint',
        },
        publicBaseUrl: {
          label: 'Public base URL',
          placeholder: 'Enter public base URL',
        },
        port: {
          label: 'Port',
          placeholder: 'Enter port',
        },
        bucketName: {
          label: 'Bucket name in S3',
          placeholder: 'Enter bucket name in S3',
        },
      },
    },
  },
  appsCategories: {
    sidebar: {
      allApps: 'All Assistants',
      header: 'Categories',
      otherCategoryItems: 'Other',
      showMore: 'Show all (%{count} more)',
    },
    form: {
      title: {
        create: 'Create assistant category',
        edit: 'Edit assistant category',
      },
      fields: {
        name: {
          label: 'Name',
          placeholder: 'Enter assistant category name',
        },
        icon: {
          label: 'Icon',
          placeholder: 'Enter assistant category icon',
        },
        description: {
          label: 'Description',
          placeholder: 'Enter category description',
        },
        organization: {
          label: 'Organization',
        },
        parentCategory: {
          label: 'Parent category',
        },
      },
    },
    manageAppsCategories: {
      title: 'Manage Assistants Categories',
    },
  },
  projects: {
    grid: {
      placeholder: 'No projects yet. Feel free to create one!',
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
        description: {
          label: 'Description',
          placeholder: 'Enter project description',
          generated: 'Auto-generate',
        },
        organization: {
          label: 'Organization',
        },
      },
    },
    files: {
      title: 'Files',
      upload: 'Upload file',
      download: 'Download file',
      delete: 'Delete file',
      emptyPlaceholder: 'No files yet. Feel free to upload one!',
    },
  },
  experts: {
    favorites: {
      add: 'Add to favorites',
      remove: 'Remove from favorites',
    },
  },
  organizations: {
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
  users: {
    form: {
      title: {
        create: 'Create user',
        edit: 'Edit user',
      },
      fields: {
        email: {
          label: 'E-Mail',
          placeholder: 'Enter e-mail address',
        },
        name: {
          label: 'Name and surname',
          placeholder: 'Enter name and surname',
        },
        flags: {
          label: 'Flags',
        },
        active: {
          label: 'Active',
        },
        organization: {
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
    row: {
      authMethod: {
        password: 'Password',
        email: 'Email',
      },
    },
    chooseUsersModal: {
      title: 'Choose users',
    },
  },
  usersGroups: {
    form: {
      title: {
        create: 'Create users group',
        edit: 'Edit users group',
      },
      fields: {
        name: {
          label: 'Name',
          placeholder: 'Enter users group name',
        },
        users: {
          label: 'Users',
        },
      },
    },
    table: {
      totalUsers: 'Total users',
    },
  },
  permissions: {
    share: 'Share',
    accessLevels: I18N_ACCESS_LEVELS_EN,
    card: {
      sharedWith: 'Shared with',
      author: 'Author',
    },
    status: {
      public: {
        tooltip: 'Everyone in organization can see this',
        title: 'Public',
      },
      private: {
        tooltip: 'Only shared users and groups can see this',
        title: 'Private',
      },
    },
    modal: {
      title: 'Share resource',
      submit: 'Share',
      makePublic: 'This resource is public (everyone in the organization can edit)',
      autocomplete: {
        users: 'Users',
        groups: 'Groups',
        placeholder: 'Search users and groups...',
        loading: 'Loading...',
      },
      list: {
        title: 'Shared with',
        empty: 'Not shared with anyone',
        users: 'Users',
        groups: 'Groups',
        owner: 'Owner',
      },
    },
  },
  footer: {
    copyright: 'Open Source AI Platform',
    madeWith: 'Made with',
    withAI: 'with AI',
    github: 'GitHub',
    blog: 'Blog',
    about: 'About',
  },
};
