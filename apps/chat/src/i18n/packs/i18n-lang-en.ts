import deepmerge from 'deepmerge';

import { I18N_FORWARDED_EN_PACK } from '@llm/ui';

export const I18N_PACK_EN = deepmerge(I18N_FORWARDED_EN_PACK, {
  navigation: {
    links: {
      home: 'Home',
      projects: 'Projects',
      apps: 'Apps',
      experts: 'Experts',
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
  },
  workspace: {
    selectOrganization: 'Select organization',
    organization: 'Organization',
  },
  chats: {
    start: {
      hello: 'Hello, how can we help you?',
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
      submitOnEnter: 'Submit on Enter',
      refresh: 'Refresh response',
      reply: 'Reply to this message',
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
  },
  experts: {
    favorites: {
      add: 'Add to favorites',
      remove: 'Remove from favorites',
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
