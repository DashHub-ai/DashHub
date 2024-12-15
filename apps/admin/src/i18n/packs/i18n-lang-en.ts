import deepmerge from 'deepmerge';

import type { SdkAIProviderT, SdkOrganizationUserRoleT, SdkUserRoleT } from '@llm/sdk';

import { I18N_FORWARDED_EN_PACK } from '@llm/ui';

const I18N_AI_PROVIDERS_EN: Record<SdkAIProviderT, string> = {
  openai: 'OpenAI',
};

const I18N_USER_ROLES_EN: Record<SdkUserRoleT, string> = {
  root: 'Root',
  user: 'User',
};

const I18N_USER_ORGANIZATION_ROLES_EN: Record<SdkOrganizationUserRoleT, string> = {
  owner: 'Owner',
  member: 'Member',
};

export const I18N_PACK_EN = deepmerge(I18N_FORWARDED_EN_PACK, {
  common: {
    email: 'Email',
    password: 'Password',
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
    },
  },
  navigation: {
    groups: {
      resources: 'Resources',
      development: 'Development',
      aiAndStorage: 'AI & Storage',
    },
    links: {
      home: 'Overview',
      organizations: 'Organizations',
      users: 'Users',
      s3Buckets: 'S3',
      projects: 'Projects',
      apps: 'Apps',
      appsCategories: 'Apps Categories',
      aiModels: 'AI Models',
    },
    loggedIn: {
      logout: 'Logout',
    },
  },
  modules: {
    searchBar: {
      viewAll: 'View all',
      input: {
        placeholder: 'Search...',
      },
      groups: {
        users: {
          header: 'Users',
          itemSubTitle: 'User',
        },
        organizations: {
          header: 'Organizations',
          itemSubTitle: 'Organization',
        },
        s3Buckets: {
          header: 'S3 Buckets',
          itemSubTitle: 'S3 Bucket',
        },
        projects: {
          header: 'Projects',
          itemSubTitle: 'Project',
        },
        apps: {
          header: 'Apps',
          itemSubTitle: 'App',
        },
      },
    },
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
          description: {
            label: 'Description',
            placeholder: 'Enter project description',
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
          category: {
            label: 'Category',
          },
          description: {
            label: 'Description',
            placeholder: 'Enter app description',
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
    appsCategories: {
      prefix: {
        category: 'Category',
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
    },
    aiModels: {
      providers: I18N_AI_PROVIDERS_EN,
      prefix: {
        app: 'AI Model',
      },
      table: {
        columns: {
          defaultForOrganization: 'Default for organization',
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
          },
          settings: {
            label: 'Settings',
          },
          defaultForOrganization: {
            label: 'Default for organization',
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
          defaultForOrganization: 'Default for organization',
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
      sections: {
        resources: {
          title: 'Resources',
          cards: {
            organizations: {
              title: 'Organizations',
              description: 'Create and manage organizations, configure their settings, and control access permissions. Set up billing, team structures, and organizational policies.',
            },
            users: {
              title: 'Users',
              description: 'Manage user accounts, roles, and permissions across the platform. Monitor user activity, handle authentication settings, and maintain security protocols.',
            },
          },
        },
        development: {
          title: 'Development Tools',
          cards: {
            apps: {
              title: 'Apps',
              description: 'Access and manage your application portfolio. Deploy, monitor, and configure applications. Track performance metrics and manage application lifecycle.',
            },
            appsCategories: {
              title: 'Apps Categories',
              description: 'Organize applications into logical categories for better management. Create hierarchical structures and maintain clear application taxonomies.',
            },
            projects: {
              title: 'Projects',
              description: 'Oversee development projects from inception to deployment. Track project progress, manage resources, and coordinate team efforts effectively.',
            },
          },
        },
        aiAndStorage: {
          title: 'AI & Storage',
          cards: {
            aiModels: {
              title: 'AI Models',
              description: 'Deploy and manage AI/ML models in production. Monitor model performance, version control, and handle model lifecycle management efficiently.',
            },
            s3Buckets: {
              title: 'S3 Buckets',
              description: 'Manage cloud storage buckets for your applications. Configure access policies, monitor storage usage, and optimize data management strategies.',
            },
          },
        },
      },
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
    appsCategories: {
      meta: {
        title: 'Apps Categories',
        description: 'Manage apps categories',
      },
      title: 'Manage apps categories',
    },
    aiModels: {
      meta: {
        title: 'AI Models',
        description: 'Manage AI models',
      },
      title: 'Manage AI models',
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
});
