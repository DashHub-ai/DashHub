import deepmerge from 'deepmerge';

import type { SdkOrganizationUserRoleT, SdkPermissionAccessLevelT } from '@llm/sdk';

import { I18N_FORWARDED_PL_PACK } from '@llm/ui';

import type { I18nLangPack } from './i18n-packs';

const I18N_ACCESS_LEVELS_PL: Record<SdkPermissionAccessLevelT, string> = {
  read: 'Tylko odczyt',
  write: 'Odczyt / Zapis',
};

const I18N_USER_ORGANIZATION_ROLES_PL: Record<SdkOrganizationUserRoleT, string> = {
  owner: 'Właściciel',
  member: 'Pracownik',
  tech: 'Technik',
};

export const I18N_PACK_PL: I18nLangPack = deepmerge(I18N_FORWARDED_PL_PACK, {
  navigation: {
    links: {
      home: 'Czaty',
      projects: 'Projekty',
      apps: 'Appki',
      experts: 'Eksperci',
      management: 'Administracja',
    },
    loggedIn: {
      logout: 'Wyloguj się',
      settings: 'Ustawienia',
    },
    loggedAsRow: {
      rootUser: 'Zalogowano jako root',
      techUser: 'Zalogowano jako user techniczny',
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
  table: {
    columns: {
      id: 'ID',
      name: 'Nazwa',
      description: 'Opis',
      email: 'E-Mail',
      archived: 'Zarchiwizowane',
      active: 'Aktywne',
      auth: 'Uwierzytelnianie',
      organization: 'Organizacja',
      parentCategory: 'Kategoria nadrzędna',
      createdAt: 'Data utworzenia',
      updatedAt: 'Data aktualizacji',
      actions: 'Akcje',
      role: 'Rola',
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
      buttons: {
        create: 'Nowa appka',
      },
    },
    appsEditor: {
      meta: {
        title: 'Edytor aplikacji',
        description: 'Edytuj aplikacje',
      },
      title: 'Edytor aplikacji',
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
    project: {
      meta: {
        title: 'Projekt',
        description: 'Zarządzaj projektem',
      },
      hello: 'Cześć, jak możemy Ci pomóc?',
      title: 'Projekt',
      chats: 'Czaty w projekcie',
      files: 'Pliki w projekcie',
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
      hello: 'Cześć, jak możemy Ci pomóc?',
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
    management: {
      meta: {
        title: 'Administracja',
        description: 'Zarządzaj ustawieniami organizacji',
      },
      title: 'Administracja',
      pages: {
        users: {
          title: 'Użytkownicy',
        },
        usersGroups: {
          title: 'Grupy użytkowników',
        },
      },
    },
  },
  workspace: {
    selectOrganization: 'Wybierz organizację',
    organization: 'Organizacja',
  },
  chats: {
    start: {
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
    prompts: {
      explainApp: '%{mention} Wyjaśnij krótko, do czego służy aplikacja i jak jej używać.',
    },
    generating: {
      title: 'Generowanie tytułu...',
      description: 'Generowanie opisu...',
    },
    actions: {
      send: 'Wyślij',
      cancel: 'Anuluj',
      submitOnEnter: 'Wyślij po naciśnięciu Enter',
      attachFile: 'Załącz plik',
      refresh: 'Odśwież odpowiedź',
      reply: 'Odpowiedz na tę wiadomość',
      expand: {
        more: 'Pokaż więcej',
        less: 'Pokaż mniej',
      },
      addApp: 'Dodaj aplikację',
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
    chooseAppModal: {
      title: 'Wybierz aplikację',
    },
  },
  appsCreator: {
    create: {
      title: 'Nowa aplikacja',
      nextStep: 'Następny krok',
      step: 'Krok',
      backStep: 'Poprzedni krok',
    },
    edit: {
      title: 'Edytuj aplikację',
    },
    fields: {
      category: {
        label: 'Kategoria',
      },
      permissions: {
        label: 'Uprawnienia',
      },
      name: {
        label: 'Nazwa',
        placeholder: 'Wpisz nazwę aplikacji',
      },
      description: {
        label: 'Opis',
        placeholder: 'Wpis opis aplikacji',
      },
      chatContext: {
        label: 'Prompt',
        placeholder: 'Wpisz opis prompt aplikacji, to pomoże AI w generowaniu odpowiedzi',
      },
    },
  },
  appsCategories: {
    sidebar: {
      allApps: 'Wszystkie aplikacje',
      header: 'Kategorie',
      showMore: 'Pokaż wszystkie (%{count} więcej)',
      otherCategoryItems: 'Pozostałe',
    },
    form: {
      title: {
        create: 'Utwórz kategorię aplikacji',
        edit: 'Edytuj kategorię aplikacji',
      },
      fields: {
        name: {
          label: 'Nazwa',
          placeholder: 'Wpisz nazwę kategorii aplikacji',
        },
        icon: {
          label: 'Ikona',
          placeholder: 'Wpisz ikonę kategorii aplikacji',
        },
        description: {
          label: 'Opis',
          placeholder: 'Wpisz opis kategorii',
        },
        organization: {
          label: 'Organizacja',
        },
        parentCategory: {
          label: 'Kategoria nadrzędna',
        },
      },
    },
    manageAppsCategories: {
      title: 'Zarządzaj kategoriami aplikacji',
    },
  },
  projects: {
    grid: {
      placeholder: 'Brak projektów! Dodaj nowy projekt, aby zacząć',
    },
    form: {
      title: {
        edit: 'Edytuj projekt',
        create: 'Utwórz projekt',
      },
      fields: {
        name: {
          label: 'Nazwa',
          placeholder: 'Wpisz nazwę projektu',
        },
        description: {
          label: 'Opis',
          placeholder: 'Wpisz opis projektu',
          generated: 'Automatycznie generuj',
        },
        organization: {
          label: 'Wybierz organizację',
        },
      },
    },
    files: {
      title: 'Pliki',
      upload: 'Dodaj plik',
      download: 'Pobierz',
      delete: 'Usuń',
      emptyPlaceholder: 'Brak plików! Dodaj nowy plik, aby zacząć.',
    },
  },
  experts: {
    favorites: {
      add: 'Dodaj do ulubionych',
      remove: 'Usuń z ulubionych',
    },
  },
  organizations: {
    userRoles: I18N_USER_ORGANIZATION_ROLES_PL,
  },
  users: {
    form: {
      title: {
        create: 'Utwórz użytkownika',
        edit: 'Edytuj użytkownika',
      },
      fields: {
        email: {
          label: 'E-Mail',
          placeholder: 'Wprowadź adres e-mail',
        },
        name: {
          label: 'Imię i nazwisko',
          placeholder: 'Wprowadź imię i nazwisko',
        },
        flags: {
          label: 'Flagi',
        },
        active: {
          label: 'Aktywny',
        },
        organization: {
          role: {
            label: 'Rola w organizacji',
          },
        },
        auth: {
          label: 'Uwierzytelnianie',
          email: {
            label: 'Email',
            placeholder: 'Wprowadź adres email',
          },
          password: {
            label: 'Hasło',
            placeholder: 'Wprowadź hasło',
          },
          resetPassword: {
            label: 'Zresetuj hasło',
          },
        },
      },
    },
    row: {
      authMethod: {
        email: 'E-Mail',
        password: 'Hasło',
      },
    },
    chooseUsersModal: {
      title: 'Wybierz użytkowników',
    },
  },
  usersGroups: {
    form: {
      title: {
        create: 'Utwórz grupę użytkowników',
        edit: 'Edytuj grupę użytkowników',
      },
      fields: {
        name: {
          label: 'Nazwa',
          placeholder: 'Wprowadź nazwę grupy',
        },
        users: {
          label: 'Użytkownicy',
        },
      },
    },
    table: {
      totalUsers: 'Użytkowników',
    },
  },
  permissions: {
    share: 'Udostępnij',
    accessLevels: I18N_ACCESS_LEVELS_PL,
    card: {
      sharedWith: 'Udostępniono dla',
      author: 'Autor',
    },
    status: {
      publicTooltip: 'Wszyscy w organizacji to widzą',
      privateTooltip: 'Tylko udostępnieni użytkownicy i grupy to widzą',
    },
    modal: {
      title: 'Udostępnij',
      submit: 'Udostępnij',
      makePublic: 'Udostępnij publicznie (dla wszystkich w organizacji).',
      autocomplete: {
        users: 'Użytkownicy',
        groups: 'Grupy',
        placeholder: 'Szukaj użytkowników lub grup...',
        loading: 'Loading...',
      },
      list: {
        title: 'Udostępniono dla',
        empty: 'Nie udostępniono nikomu',
        users: 'Użytkownicy',
        groups: 'Grupy',
        owner: 'Właściciel',
      },
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
