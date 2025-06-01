import type {
  SdkAIProviderT,
  SdkOrganizationUserRoleT,
  SdkPermissionAccessLevelT,
  SdkSearchEngineProviderT,
  SdkTranslatedErrors,
} from '@dashhub/sdk';

import type { I18nLangPack } from './i18n-packs';

const I18N_SDK_ERRORS_PL: Record<SdkTranslatedErrors['tag'], string> = {
  SdkIncorrectUsernameOrPasswordError: 'Nieprawidłowy adres e-mail lub hasło',
  SdkDecodeTokenFormatError: 'Nieprawidłowy format tokenu',
  SdkPayloadValidationError: 'Błąd walidacji danych',
  SdkRequestError: 'Błąd żądania',
  SdkServerError: 'Błąd serwera',
  SdkUnauthorizedError: 'Nieautoryzowany',
  SdkInvalidJwtTokenError: 'Niepoprawny format tokenu JWT',
  SdkRecordAlreadyExistsError: 'Rekord już istnieje',
  SdkRecordNotFoundError: 'Rekord nie znaleziono',
  SdkEndpointNotFoundError: 'Nieprawidłowy endpoint API',
  SdkInvalidRequestError: 'Nieprawidłowy format żądania',
};

const I18N_AI_PROVIDERS_PL: Record<SdkAIProviderT, string> = {
  openai: 'OpenAI',
  gemini: 'Gemini',
  deepseek: 'DeepSeek',
  other: 'Other',
};

const I18N_SEARCH_ENGINE_PROVIDERS_PL: Record<SdkSearchEngineProviderT, string> = {
  serper: 'Serper',
};

const I18N_ACCESS_LEVELS_PL: Record<SdkPermissionAccessLevelT, string> = {
  read: 'Tylko odczyt',
  write: 'Odczyt / Zapis',
};

const I18N_USER_ORGANIZATION_ROLES_PL: Record<SdkOrganizationUserRoleT, string> = {
  owner: 'Właściciel',
  member: 'Pracownik',
  tech: 'Technik',
};

export const I18N_PACK_PL: I18nLangPack = {
  placeholders: {
    search: 'Szukaj...',
    selectItem: 'Wybierz element',
    noItemsFound: 'Nie znaleziono elementów',
    noDescription: 'Brak opisu',
  },
  tutorialBox: {
    gotIt: 'Rozumiem',
  },
  form: {
    clearFile: 'Wyczyść plik',
    alerts: {
      saveSuccess: 'Pomyślnie zapisano zmiany!',
      saveError: 'Nie udało się zapisać zmian!',
    },
  },
  links: {
    seeAll: 'Zobacz wszystko',
  },
  buttons: {
    edit: 'Edytuj',
    install: 'Zainstaluj',
    archive: 'Archiwizuj',
    open: 'Otwórz',
    unarchive: 'Odzyskaj',
    delete: 'Usuń',
    cancel: 'Anuluj',
    create: 'Utwórz',
    resetFilters: 'Resetuj filtry',
    save: 'Zapisz',
    update: 'Aktualizuj',
    close: 'Zamknij',
    add: 'Dodaj',
    confirm: 'Potwierdź',
    download: 'Pobierz',
    select: 'Wybierz',
    selected: 'Wybrano',
    choose: 'Wybierz',
    expand: {
      more: 'Więcej',
      less: 'Mniej',
    },
  },
  errors: {
    tagged: I18N_SDK_ERRORS_PL,
  },
  validation: {
    required: 'To pole jest wymagane',
    invalidEmail: 'To pole musi być adresem e-mail',
    mustBeLargerThan: 'To pole musi być większe niż %{number}',
    password: {
      mustBeLongerThan: 'Hasło musi mieć więcej niż %{number} znaków',
    },
  },
  notifications: {
    save: {
      success: 'Zapisano pomyślnie',
      error: 'Wystąpił błąd podczas zapisywania',
    },
  },
  pagination: {
    itemsPerPage: 'Elementów na stronę',
    showNthToNthOf: 'Pokazano %{from} - %{to} z %{total}',
    pageNthOfTotal: 'Strona %{page} z %{total}',
    searchPlaceholder: 'Wpisz frazę wyszukiwania...',
    goto: {
      firstPage: 'Pierwsza strona',
      previousPage: 'Poprzednia strona',
      nextPage: 'Następna strona',
      lastPage: 'Ostatnia strona',
    },
  },
  badges: {
    archive: {
      archived: 'Zarchiwizowane',
      active: 'Aktywne',
    },
    boolean: {
      yes: 'Tak',
      no: 'Nie',
    },
  },
  sidebar: {
    noLinksAvailable: 'Brak dostępnych linków',
    startChat: 'Nowy czat',
    chats: {
      title: 'Ostatnie czaty',
      all: 'Wszystkie czaty',
    },
    favoriteChats: {
      title: 'Ulubione czaty',
      all: 'Wszystkie ulubione czaty',
    },
    favoriteApps: {
      title: 'Ulubieni agenci',
      all: 'Wszyscy ulubieni agenci',
    },
    projects: {
      title: 'Ostatnie projekty',
      all: 'Wszystkie projekty',
    },
    apps: {
      title: 'Ostatni agenci',
      all: 'Wszyscy agenci',
    },
  },
  modals: {
    archiveConfirm: {
      title: 'Archiwizuj',
      message: {
        single: 'Czy na pewno chcesz zarchiwizować ten element? Ten element może nadal być widoczny w przypisanych lokalizacjach systemowych po zarchiwizowaniu.',
        multiple: 'Czy na pewno chcesz zarchiwizować te %{count} elementy? Te elementy mogą nadal być widoczne w przypisanych lokalizacjach systemowych po zarchiwizowaniu.',
      },
      yesIAmSure: 'Tak, jestem pewny',
    },
    unarchiveConfirm: {
      title: 'Odzyskaj',
      message: {
        single: 'Czy na pewno chcesz odzyskać ten element?',
        multiple: 'Czy na pewno chcesz odzyskać te %{count} elementów?',
      },
      yesIAmSure: 'Tak, jestem pewny',
    },
    deleteConfirm: {
      title: 'Usuń',
      message: {
        single: 'Czy na pewno chcesz usunąć ten element?',
        multiple: 'Czy na pewno chcesz usunąć te %{count} elementy?',
      },
      yesIAmSure: 'Tak, jestem pewny',
    },
  },
  tabs: {
    archiveFilters: {
      all: 'Wszystkie',
      active: 'Aktywne',
      archived: 'Zarchiwizowane',
    },
    favoriteFilters: {
      all: 'Wszystkie',
      favorite: 'Ulubione',
      rest: 'Reszta',
    },
  },
  navigation: {
    backToHome: 'Powrót do strony głównej',
    links: {
      home: 'Strona główna',
      chats: 'Czaty',
      projects: 'Projekty',
      apps: 'Agenci',
      experts: 'Eksperci',
      management: 'Administracja',
      pinnedMessages: 'Piny',
      aiExternalAPIs: 'Integracje',
    },
    loggedIn: {
      logout: 'Wyloguj się',
      settings: 'Ustawienia',
      management: 'Zarządzanie',
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
      apps: 'Agenci',
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
    home: {
      header: {
        primary: 'Co chcesz dziś zrobić?',
        secondary: 'Agenci AI do uproszczenia, przyspieszenia i wsparcia Twojej pracy.',
      },
      meta: {
        title: 'Strona Główna',
        description: 'Strona główna DashHub Chat',
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
        title: 'Aystenci',
        description: 'Zarządzaj aplikacjami',
      },
      title: 'Aystenci',
      tutorial: {
        title: 'Czym są Aystenci DashHub?',
        tools: 'Specjalistyczne narzędzia oparte na LLM do tworzenia e-maili, organizacji danych i transformacji treści',
        modular: 'Modularne i wielokrotnego użytku aplikacje zwiększające produktywność w projektach',
      },
      buttons: {
        create: 'Stwórz',
      },
      tabs: {
        installed: 'Zainstalowane',
        marketplace: 'Sklep',
      },
    },
    editApp: {
      meta: {
        title: 'Edytuj Asystenta',
        description: 'Edytuj asystenta',
      },
      title: 'Edytuj Asystenta',
    },
    createApp: {
      meta: {
        title: 'Stwórz agenta',
        description: 'Stwórz agenta',
      },
      title: 'Stwórz agenta',
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
        custom: 'Wyspecjalizowani agenci AI zaprojektowani do konkretnych zadań i dziedzin',
        organization: 'Wdrażaj i zarządzaj ekspertami AI w całej organizacji',
        knowledge: 'Wzbogaceni o wiedzę specyficzną dla projektu dla dokładniejszej pomocy',
      },
    },
    pinnedMessages: {
      meta: {
        title: 'Przypięte wiadomości',
        description: 'Zarządzaj przypiętymi wiadomościami',
      },
      title: 'Przypięte wiadomości',
    },
    settings: {
      meta: {
        title: 'Ustawienia',
        description: 'Zarządzaj ustawieniami',
      },
      title: 'Ustawienia',
      pages: {
        me: {
          title: 'Mój profil',
        },
        myOrganization: {
          title: 'Moja organizacja',
        },
      },
    },
    chats: {
      meta: {
        title: 'Czaty',
        description: 'Czaty',
      },
      title: 'Czaty',
      hello: 'Cześć, jak możemy Ci pomóc?',
      tutorial: {
        title: 'Witaj w DashHub Chat!',
        ai: 'Potężny agent AI gotowy pomóc w Twoich zadaniach i pytaniach',
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
      sections: {
        organizations: 'Organizacje',
        users: 'Administratorzy',
      },
    },
    aiExternalAPIs: {
      meta: {
        title: 'Integracje',
        description: 'Zarządzaj integracjami',
      },
      title: 'Integracje',
      buttons: {
        create: 'Utwórz integrację',
      },
    },
    editAIExternalAPI: {
      meta: {
        title: 'Edytuj integrację',
        description: 'Edytuj integrację',
      },
      title: 'Edytuj integrację',
    },
    createAIExternalAPI: {
      meta: {
        title: 'Utwórz integrację',
        description: 'Utwórz integrację',
      },
      title: 'Utwórz integrację',
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
        organization: {
          title: 'Organizacja',
        },
        usersGroups: {
          title: 'Grupy użytkowników',
        },
        aiModels: {
          title: 'Modele AI',
        },
        s3Buckets: {
          title: 'Kubełki S3',
        },
        searchEngines: {
          title: 'Wyszukiwarki',
        },
      },
    },
  },
  workspace: {
    selectOrganization: 'Wybierz organizację',
    organization: 'Organizacja',
  },
  aiExternalAPIs: {
    grid: {
      placeholder: 'Brak zewnętrznych API! Utwórz nowe API, aby rozpocząć.',
    },
    fields: {
      name: {
        label: 'Nazwa',
        placeholder: 'Wpisz nazwę integracji',
      },
      description: {
        label: 'Opis',
        placeholder: 'Wpisz opis integracji, będzie on używany przez AI do analizy narzędzia.',
      },
      organization: {
        label: 'Organizacja',
      },
      permissions: {
        label: 'Uprawnienia',
      },
      logo: {
        label: 'Logo',
        placeholder: 'Wybierz logo integracji',
      },
      schema: {
        label: 'Schemat',
        globalApiSettings: 'Ustawienia globalne API',
        apiUrl: {
          label: 'Base API URL',
        },
        endpoint: {
          add: 'Dodaj endpoint',
          path: {
            label: 'Ścieżka',
            placeholder: 'Tylko ścieżka (np. /api/zasób), nie pełny URL',
          },
          functionName: {
            label: 'Nazwa funkcji',
            placeholder: 'Nazwa funkcji (np. pobierzDaneUżytkownika)',
          },
          description: {
            label: 'Opis',
            placeholder: 'Opisz, co robi ten endpoint i jakie informacje udostępnia',
          },
          parameters: {
            label: 'Parametry',
          },
        },
        parameter: {
          add: 'Dodaj parametr',
          columns: {
            name: 'Nazwa',
            type: 'Typ',
            placement: 'Umiejscowienie',
            generated: 'Generowany przez AI',
            description: 'Opis',
            required: 'Zawsze generuj',
            value: 'Wartość',
            actions: 'Akcje',
            ai: 'AI',
          },
          placeholders: {
            name: 'Wpisz nazwę parametru',
            description: 'Wpisz opis parametru',
            numberValue: 'Wpisz wartość liczbową',
            textValue: 'Wpisz wartość tekstową',
          },
        },
        endpoints: {
          label: 'Endpointy API',
          placeholder: 'Wpisz endpointy integracji',
          empty: 'Brak endpointów API',
        },
        parameters: {
          label: 'Parametry',
          placeholder: 'Wpisz parametry integracji',
          empty: 'Brak parametrów',
        },
      },
    },
  },
  searchBar: {
    viewAll: 'Zobacz wszystkie',
    input: {
      placeholder: 'Szukaj...',
    },
    groups: {
      messages: {
        header: 'Wiadomości',
        itemSubTitle: 'Wiadomość',
      },
      chats: {
        header: 'Czaty',
        itemSubTitle: 'Czat',
      },
      projects: {
        header: 'Projekty',
        itemSubTitle: 'Projekt',
      },
      apps: {
        header: 'Aplikacje',
        itemSubTitle: 'Aplikacja',
      },
    },
  },
  chats: {
    start: {
      placeholder: 'Wpisz swoją wiadomość tutaj...',
      addFile: 'Dodaj plik',
      selectProject: 'Wybierz projekt',
      publicChat: 'Czat publiczny',
      privateChat: 'Czat prywatny',
      start: 'Rozpocznij czat',
      startOnEnter: 'Rozpocznij po wciśnięciu Enter',
      selectModel: 'Model AI',
    },
    favorite: {
      title: 'Ulubione czaty',
      placeholder: 'Brak ulubionych czatów',
    },
    history: {
      title: 'Twoje czaty',
      placeholder: 'Brak czatów',
    },
  },
  chat: {
    title: 'Czat',
    archived: 'Czat jest zarchiwizowany',
    card: {
      noTitle: 'Czat bez nazwy',
      noDescription: 'Brak opisu',
      totalMessages: 'Wiadomości',
      continueChat: 'Kontynuuj czat',
    },
    webSearch: {
      toggle: 'Wyszukuj w sieci',
    },
    app: {
      attached: 'Załączono aplikację',
    },
    messages: {
      empty: 'Brak wiadomości',
      you: 'Ty',
      ai: 'AI',
      webSearch: 'Wyszukiwanie w sieci',
      saved: 'Zapisane na potem',
    },
    widgets: {
      code: {
        copy: 'Kopiuj',
        copied: 'Skopiowano!',
        run: 'Uruchom',
        stop: 'Zatrzymaj',
        preview: {
          addressBar: 'Podgląd',
        },
      },
    },
    generating: {
      title: 'Generowanie tytułu...',
      description: 'Generowanie opisu...',
    },
    actions: {
      send: 'Wyślij',
      cancel: 'Anuluj',
      submitOnEnter: 'Wyślij po naciśnięciu Enter',
      refresh: 'Odśwież odpowiedź',
      copy: 'Kopiuj',
      copied: 'Copied',
      reply: 'Odpowiedz na tę wiadomość',
      expand: {
        more: 'Pokaż więcej',
        less: 'Pokaż mniej',
      },
      addApp: 'Dodaj aplikację',
      pin: 'Przypnij',
      unpin: 'Odepnij',
      files: {
        attachFile: 'Załącz plik',
        attachLocalFile: 'Załącz plik ze swojego komputera',
        attachGoogleDriveFile: 'Załącz plik z Google Drive',
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
  prompts: {
    hello: 'Cześć! 👋',
    attachApp: [
      'Pokaż mi, jak używać tej aplikacji',
      'Jakie są główne funkcje tej aplikacji?',
      'Podaj mi przykłady tego, co mogę zrobić z tą aplikacją',
      'Jakie są najlepsze praktyki korzystania z tej aplikacji?',
    ],
  },
  apps: {
    favorites: {
      add: 'Dodaj do ulubionych',
      remove: 'Usuń z ulubionych',
    },
    grid: {
      placeholder: 'Brak agenta!',
    },
    chooseAppModal: {
      title: 'Wybierz aplikację',
    },
    card: {
      startChat: 'Nowy czat',
      continueChat: 'Kontynuuj czat',
    },
  },
  appsCreator: {
    files: {
      title: 'Pliki',
    },
    create: {
      title: 'Nowa aplikacja',
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
      aiModel: {
        label: 'Preferowany model AI',
      },
      name: {
        label: 'Nazwa',
        placeholder: 'Wpisz nazwę agenta',
      },
      description: {
        label: 'Opis',
        placeholder: 'Wpis opis agenta',
      },
      promotion: {
        label: 'Priorytet promocji',
        placeholder: 'Wpisz priorytet promocji',
      },
      logo: {
        label: 'Logo',
      },
      chatContext: {
        label: 'Prompt',
        placeholder: 'Wpisz opis prompt agenta, to pomoże AI w generowaniu odpowiedzi',
      },
      aiExternalAPI: {
        label: 'Zewnętrzne API',
        toggle: 'Użyj zewnętrznego API',
      },
    },
  },
  s3Buckets: {
    prefix: {
      s3Bucket: 'Kubełek S3',
    },
    table: {
      columns: {
        accessKeyId: 'Access key',
        defaultForOrganization: 'Domyślny',
      },
    },
    form: {
      title: {
        create: 'Utwórz kubełek S3',
        edit: 'Edytuj kubełek S3',
      },
      fields: {
        name: {
          label: 'Nazwa',
          placeholder: 'Wpisz nazwę kubełka S3',
        },
        organization: {
          label: 'Organizacja',
        },
        settings: {
          label: 'Ustawienia',
        },
        defaultForOrganization: {
          label: 'Domyślny dla organizacji',
        },
        region: {
          label: 'Region',
          placeholder: 'Wpisz region',
        },
        accessKeyId: {
          label: 'Access key',
          placeholder: 'Wpisz access key',
        },
        secretAccessKey: {
          label: 'Secret key',
          placeholder: 'Wpisz secret key',
        },
        default: {
          label: 'Domyślny',
        },
        ssl: {
          label: 'SSL',
        },
        endpoint: {
          label: 'Endpoint',
          placeholder: 'Wpisz endpoint',
        },
        publicBaseUrl: {
          label: 'Publiczny URL bazowy',
          placeholder: 'Wpisz publiczny URL bazowy',
        },
        port: {
          label: 'Port',
          placeholder: 'Wpisz port',
        },
        bucketName: {
          label: 'Nazwa kubełka w S3',
          placeholder: 'Wpisz nazwę kubełka w S3',
        },
      },
    },
  },
  searchEngines: {
    providers: I18N_SEARCH_ENGINE_PROVIDERS_PL,
    title: 'Wyszukiwarki',
    table: {
      columns: {
        defaultForOrganization: 'Domyślny',
      },
    },
    form: {
      title: {
        create: 'Utwórz wyszukiwarkę',
        edit: 'Edytuj wyszukiwarkę',
      },
      fields: {
        name: {
          label: 'Nazwa',
          placeholder: 'Wprowadź nazwę wyszukiwarki',
        },
        description: {
          label: 'Opis',
          placeholder: 'Wprowadź opis wyszukiwarki',
        },
        organization: {
          label: 'Organizacja',
        },
        settings: {
          label: 'Ustawienia',
        },
        defaultForOrganization: {
          label: 'Domyślna dla organizacji',
        },
        provider: {
          label: 'Dostawca wyszukiwarki',
        },
        credentials: {
          apiKey: {
            label: 'Klucz API',
            placeholder: 'Wprowadź klucz API',
          },
        },
      },
    },
  },
  aiModels: {
    providers: I18N_AI_PROVIDERS_PL,
    prefix: {
      app: 'Model AI',
    },
    table: {
      columns: {
        defaultForOrganization: 'Domyślny',
      },
    },
    form: {
      title: {
        create: 'Utwórz model AI',
        edit: 'Edytuj model AI',
      },
      fields: {
        name: {
          label: 'Nazwa',
          placeholder: 'Wpisz nazwę modelu AI',
        },
        description: {
          label: 'Opis',
          placeholder: 'Wpisz opis modelu AI',
        },
        organization: {
          label: 'Organizacja',
        },
        provider: {
          label: 'Dostawca AI',
        },
        credentials: {
          apiModel: {
            label: 'Model API',
            placeholder: 'Wpisz model API',
          },
          apiKey: {
            label: 'Klucz API',
            placeholder: 'Wpisz klucz API',
          },
          apiUrl: {
            label: 'URL API',
            placeholder: 'Wpisz URL API',
          },
        },
        settings: {
          label: 'Ustawienia',
        },
        defaultForOrganization: {
          label: 'Domyślny dla organizacji',
        },
        embedding: {
          label: 'Embedding',
        },
        vision: {
          label: 'Wizja',
        },
      },
    },
  },
  appsCategories: {
    sidebar: {
      allApps: 'Wszyscy agenci',
      favoriteApps: 'Ulubieni',
      recentApps: 'Ostatnio używani',
      header: 'Kategorie',
      showMore: 'Pokaż wszystkie (%{count} więcej)',
      otherCategoryItems: 'Pozostałe',
      noCategories: 'Brak kategorii!',
    },
    form: {
      title: {
        create: 'Utwórz kategorię agenta',
        edit: 'Edytuj kategorię agenta',
      },
      fields: {
        name: {
          label: 'Nazwa',
          placeholder: 'Wpisz nazwę kategorii agenta',
        },
        icon: {
          label: 'Ikona',
          placeholder: 'Wpisz ikonę kategorii agenta',
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
      title: 'Zarządzaj kategoriami agentów',
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
  pinnedMessages: {
    grid: {
      placeholder: 'Brak przypiętych wiadomości! Dodaj nową wiadomość, aby zacząć',
    },
    buttons: {
      goToChat: 'Przejdź do czatu',
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
    form: {
      title: {
        edit: 'Edytuj organizację',
        create: 'Utwórz organizację',
      },
      knowledgeFiles: 'Pliki wiedzy',
      fields: {
        name: {
          label: 'Nazwa',
          placeholder: 'Wpisz nazwę organizacji',
        },
        aiSettings: {
          chatContext: {
            label: 'Personalizacja czatu',
            placeholder: 'Wpisz jak AI powinno dostosować się do czatów',
          },
        },
      },
    },
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
        avatar: {
          label: 'Avatar',
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
        aiSettings: {
          chatContext: {
            label: 'Personalizacja czatu',
            placeholder: 'Wpisz jak AI powinno dostosować się do czatów',
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
      sharedWith: 'Udostępniono',
      author: 'Autor',
    },
    status: {
      public: {
        tooltip: 'Wszyscy w organizacji to widzą',
        title: 'Publiczny',
      },
      private: {
        tooltip: 'Tylko udostępnieni użytkownicy i grupy to widzą',
        title: 'Prywatny',
      },
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
};
