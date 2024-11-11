import deepmerge from 'deepmerge';

import { I18N_FORWARDED_EN_PACK } from '@llm/ui';

export const I18N_PACK_EN = deepmerge(I18N_FORWARDED_EN_PACK, {
  navigation: {
    links: {
      home: 'Chats',
      projects: 'Projects',
      apps: 'Apps',
      experts: 'Experts',
      settings: 'Settings',
    },
    loggedIn: {
      logout: 'Logout',
    },
    search: {
      placeholder: 'Search...',
      button: 'Search',
    },
    notifications: {
      title: 'Notifications',
      empty: 'No new notifications',
    },
    github: 'View on GitHub',
  },
  breadcrumbs: {
    routes: {
      home: 'Home',
    },
  },
  components: {
    tutorialBox: {
      gotIt: 'Got it, dismiss',
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
  },
  startChat: {
    hello: 'Hello, how can we help you?',
    placeholder: 'Type your message here...',
    addFile: 'Add file',
    selectProject: 'Select project',
    publicChat: 'Public chat',
    privateChat: 'Private chat',
    start: 'Start chat',
    selectModel: 'AI Model',
  },
  apps: {
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
