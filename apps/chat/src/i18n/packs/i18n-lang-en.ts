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
});
