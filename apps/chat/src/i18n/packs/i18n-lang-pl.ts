import deepmerge from 'deepmerge';

import { I18N_FORWARDED_PL_PACK } from '@llm/ui';

import type { I18nLangPack } from './i18n-packs';

export const I18N_PACK_PL: I18nLangPack = deepmerge(I18N_FORWARDED_PL_PACK, {
  navigation: {
    links: {
      home: 'Czaty',
      projects: 'Projekty',
      apps: 'Aplikacje',
      experts: 'Eksperci',
      settings: 'Ustawienia',
    },
    loggedIn: {
      logout: 'Wyloguj się',
    },
  },
  breadcrumbs: {
    routes: {
      home: 'Strona główna',
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
        title: 'Zaloguj się',
        description: 'Zaloguj się na swoje konto',
      },
      emailStep: {
        title: 'Zaloguj się',
        description: 'Wpisz swój adres e-mail poniżej, aby zalogować się na swoje konto',
        email: 'Adres e-mail',
      },
      passwordStep: {
        title: 'Zaloguj się',
        description: 'Wpisz swoje hasło poniżej, aby zalogować się na swoje konto',
        email: 'Adres e-mail',
        password: 'Hasło',
        remember: 'Zapamiętaj mnie',
      },
      orContinueWith: 'Lub kontynuuj za pomocą',
      cta: {
        loginUsingEmail: 'Zaloguj się za pomocą e-maila',
        loginUsingPassword: 'Zaloguj się za pomocą hasła',
      },
      terms: {
        phrase: 'Klikając przycisk kontynuuj, zgadzasz się z naszymi %{terms} i %{privacy}.',
        terms: 'Warunkami korzystania z usługi',
        privacy: 'Polityką prywatności',
      },
    },
    apps: {
      meta: {
        title: 'Aplikacje',
        description: 'Zarządzaj aplikacjami',
      },
      title: 'Aplikacje',
    },
    projects: {
      meta: {
        title: 'Projekty',
        description: 'Zarządzaj projektami',
      },
      title: 'Projekty',
    },
    experts: {
      meta: {
        title: 'Eksperci',
        description: 'Zarządzaj ekspertami',
      },
      title: 'Eksperci',
    },
    settings: {
      meta: {
        title: 'Ustawienia',
        description: 'Zarządzaj ustawieniami',
      },
      title: 'Ustawienia',
    },
    home: {
      meta: {
        title: 'Strona główna',
        description: 'Strona główna',
      },
      title: 'Czaty',
    },
  },
  startChat: {
    hello: 'Cześć, jak możemy Ci pomóc?',
    placeholder: 'Wpisz swoją wiadomość tutaj...',
    addFile: 'Dodaj plik',
    selectProject: 'Wybierz projekt',
    publicChat: 'Czat publiczny',
    privateChat: 'Czat prywatny',
    start: 'Rozpocznij czat',
    selectModel: 'Model AI',
  },
});
