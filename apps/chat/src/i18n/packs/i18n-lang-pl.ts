import deepmerge from 'deepmerge';

import { I18N_FORWARDED_PL_PACK } from '@llm/ui';

import type { I18nLangPack } from './i18n-packs';

export const I18N_PACK_PL: I18nLangPack = deepmerge(I18N_FORWARDED_PL_PACK, {
  navigation: {
    links: {
      home: 'Strona główna',
      projects: 'Projekty',
      apps: 'Aplikacje',
      experts: 'Eksperci',
    },
    loggedIn: {
      logout: 'Wyloguj się',
      settings: 'Ustawienia',
    },
    search: {
      placeholder: 'Szukaj...',
      button: 'Szukaj',
    },
    notifications: {
      title: 'Powiadomienia',
      empty: 'Brak nowych powiadomień',
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
      tutorial: {
        title: 'Czym są Eksperci DashHub?',
        custom: 'Wyspecjalizowani asystenci AI zaprojektowani do konkretnych zadań i dziedzin',
        organization: 'Wdrażaj i zarządzaj ekspertami AI w całej organizacji',
        knowledge: 'Wzbogaceni o wiedzę specyficzną dla projektu dla dokładniejszej pomocy',
      },
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
    chat: {
      meta: {
        title: 'Czat',
        description: 'Rozmawiaj z AI',
      },
      title: 'Czat',
    },
    chooseOrganization: {
      meta: {
        title: 'Wybierz organizację',
        description: 'Wybierz organizację',
      },
      title: 'Wybierz organizację',
      tutorial: {
        title: 'Wymagany wybór organizacji',
        select: 'Użyj rozwijanej listy w nawigacji, aby wybrać swoją organizację',
        dashboard: 'Wybór organizacji jest wymagany do korzystania z funkcji panelu',
        rootOnly: 'Ten krok jest wymagany tylko dla użytkowników root - zwykli użytkownicy są automatycznie przypisani do swojej organizacji',
      },
    },
  },
  workspace: {
    selectOrganization: 'Wybierz organizację',
    organization: 'Organizacja',
  },
  chats: {
    start: {
      hello: 'Cześć, jak możemy Ci pomóc?',
      placeholder: 'Wpisz swoją wiadomość tutaj...',
      addFile: 'Dodaj plik',
      selectProject: 'Wybierz projekt',
      publicChat: 'Czat publiczny',
      privateChat: 'Czat prywatny',
      start: 'Rozpocznij czat',
      startOnEnter: 'Rozpocznij czat po naciśnięciu Enter',
      selectModel: 'Model AI',
    },
    history: {
      title: 'Twoje czaty',
      placeholder: 'Brak czatów',
    },
  },
  chat: {
    title: 'Czat',
    archived: 'Czat jest zarchiwizowany',
    messages: {
      empty: 'Brak wiadomości',
      you: 'Ty',
      ai: 'AI',
    },
    generating: {
      title: 'Generowanie tytułu...',
      description: 'Generowanie opisu...',
    },
    actions: {
      send: 'Wyślij',
      submitOnEnter: 'Wyślij po naciśnięciu Enter',
      refresh: 'Odśwież odpowiedź',
      reply: 'Odpowiedz na tę wiadomość',
      expand: {
        more: 'Pokaż więcej',
        less: 'Pokaż mniej',
      },
    },
    placeholders: {
      enterMessage: 'Wpisz wiadomość...',
    },
    config: {
      title: 'Konfiguracja czatu',
      name: 'Tytuł czatu',
      namePlaceholder: 'Wprowadź tytuł...',
      description: 'Opis czatu',
      descriptionPlaceholder: 'Wprowadź opis...',
      generated: 'Automatycznie generuj',
      summary: 'Podsumowanie czatu',
      tutorial: {
        title: 'Konfiguracja czatu',
        help: {
          title: 'Tytuł i opis pomagają zidentyfikować czaty w historii',
          autoGenerate: 'Dzięki automatycznemu generowaniu podsumowania czatu możesz zaoszczędzić czas i zachować spójność w historii',
        },
      },
      archive: {
        title: 'Archiwizuj swój czat',
        description: 'Archiwizuj swój czat, aby zachować historię i kontekst, ale ukryć go z aktywnych czatów. Nadal będziesz mógł go odtworzyć w dowolnym momencie.',
        button: 'Archiwizuj czat',
      },
      unarchive: {
        title: 'Odtwórz swój czat',
        description: 'Przywróć swój czat z powrotem do aktywnych czatów.',
        button: 'Przywróć czat',
      },
    },
  },
  apps: {
    favorites: {
      add: 'Dodaj do ulubionych',
      remove: 'Usuń z ulubionych',
    },
    grid: {
      placeholder: 'Brak aplikacji!',
    },
  },
  experts: {
    favorites: {
      add: 'Dodaj do ulubionych',
      remove: 'Usuń z ulubionych',
    },
  },
  footer: {
    copyright: 'Platforma AI Open Source',
    madeWith: 'Stworzone z',
    withAI: 'z AI',
    github: 'GitHub',
    blog: 'Blog',
    about: 'O nas',
  },
});
