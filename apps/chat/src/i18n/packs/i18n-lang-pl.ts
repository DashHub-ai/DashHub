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
    search: {
      placeholder: 'Szukaj...',
      button: 'Szukaj',
    },
    notifications: {
      title: 'Powiadomienia',
      empty: 'Brak nowych powiadomień',
    },
    github: 'Zobacz na GitHub',
  },
  breadcrumbs: {
    routes: {
      home: 'Strona główna',
    },
  },
  components: {
    tutorialBox: {
      gotIt: 'Rozumiem',
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
      tutorial: {
        title: 'Czym są Aplikacje DashHub?',
        tools: 'Specjalistyczne narzędzia oparte na LLM do tworzenia e-maili, organizacji danych i transformacji treści',
        modular: 'Modularne i wielokrotnego użytku aplikacje zwiększające produktywność w projektach',
      },
    },
    projects: {
      meta: {
        title: 'Projekty',
        description: 'Zarządzaj projektami',
      },
      title: 'Projekty',
      buttons: {
        create: 'Utwórz projekt',
      },
      tutorial: {
        title: 'Czym są Projekty DashHub?',
        spaces: 'Twórz spersonalizowane przestrzenie robocze z dedykowanymi bazami wiedzy i konfiguracją',
        collaboration: 'Buduj wspólnie - zapraszaj członków zespołu i współpracuj w jednym środowisku',
        context: 'Zachowuj historię rozmów i kontekst projektu dla ciągłego postępu',
      },
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
      tutorial: {
        title: 'Witaj w DashHub Chat!',
        ai: 'Potężny asystent AI gotowy pomóc w Twoich zadaniach i pytaniach',
        knowledge: 'Dostęp do obszernej bazy wiedzy i wyspecjalizowanych narzędzi',
        history: 'Śledź i kontynuuj swoje rozmowy bez przeszkód',
      },
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
  footer: {
    copyright: 'Platforma AI Open Source',
    madeWith: 'Stworzone z',
    withAI: 'z AI',
    github: 'GitHub',
    blog: 'Blog',
    docs: 'Dokumentacja',
  },
});
