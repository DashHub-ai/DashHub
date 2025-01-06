import deepmerge from 'deepmerge';

import type { SdkOrganizationUserRoleT } from '@llm/sdk';

import { I18N_FORWARDED_EN_PACK } from '@llm/ui';

const I18N_USER_ORGANIZATION_ROLES_EN: Record<SdkOrganizationUserRoleT, string> = {
  owner: 'Owner',
  member: 'Member',
  tech: 'Tech',
};

export const I18N_PACK_EN = deepmerge(I18N_FORWARDED_EN_PACK, {
  navigation: {
    links: {
      home: 'Chats',
      projects: 'Projects',
      apps: 'Apps',
      experts: 'Experts',
      management: 'Management',
    },
    loggedIn: {
      logout: 'Logout',
      settings: 'Settings',
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
        title: 'Apps',
        description: 'Manage apps',
      },
      title: 'Apps',
      tutorial: {
        title: 'What are DashHub Apps?',
        tools: 'Specialized LLM-powered tools for email composition, data organization, and content transformation',
        modular: 'Modular and reusable applications to boost your productivity across projects',
      },
      buttons: {
        create: 'New app',
      },
    },
    appsEditor: {
      meta: {
        title: 'App Editor',
        description: 'Edit app',
      },
      title: 'App Editor',
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
      },
    },
  },
  workspace: {
    selectOrganization: 'Select organization',
    organization: 'Organization',
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
    messages: {
      empty: 'No messages yet',
      you: 'You',
      ai: 'AI',
    },
    prompts: {
      explainApp: '%{mention}Could you briefly explain what this app does and how to use it?',
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
  apps: {
    favorites: {
      add: 'Add to favorites',
      remove: 'Remove from favorites',
    },
    grid: {
      placeholder: 'No apps yet. Stay tuned!',
    },
    chooseAppModal: {
      title: 'Choose App',
    },
  },
  appsCreator: {
    create: {
      title: 'Create New App',
      nextStep: 'Next step',
      step: 'Step',
      backStep: 'Previous step',
    },
    edit: {
      title: 'Edit App',
    },
    fields: {
      category: {
        label: 'Category',
      },
      name: {
        label: 'Name',
        placeholder: 'Enter app name',
      },
      description: {
        label: 'Description',
        placeholder: 'Enter app description',
      },
      chatContext: {
        label: 'Chat prompt',
        placeholder: 'Enter app chat prompt description, it will help AI generate responses',
      },
    },
  },
  appsCategories: {
    sidebar: {
      allApps: 'All Apps',
      header: 'Categories',
      otherCategoryItems: 'Other',
      showMore: 'Show all (%{count} more)',
    },
    form: {
      title: {
        create: 'Create app category',
        edit: 'Edit app category',
      },
      fields: {
        name: {
          label: 'Name',
          placeholder: 'Enter app category name',
        },
        icon: {
          label: 'Icon',
          placeholder: 'Enter app category icon',
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
      title: 'Manage Apps Categories',
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
  footer: {
    copyright: 'Open Source AI Platform',
    madeWith: 'Made with',
    withAI: 'with AI',
    github: 'GitHub',
    blog: 'Blog',
    about: 'About',
  },
});
