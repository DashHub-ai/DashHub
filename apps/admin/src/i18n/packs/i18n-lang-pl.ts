import type { SdkTranslatedErrors } from './i18n-lang-en';
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
};

export const I18N_PACK_PL: I18nLangPack = {
  validation: {
    required: 'To pole jest wymagane',
    invalidEmail: 'To pole musi być adresem e-mail',
    mustBeLargerThan: 'To pole musi być większe niż %{number}',
  },
  errors: {
    tagged: I18N_SDK_ERRORS_PL,
  },
  buttons: {
    create: 'Utwórz',
    cancel: 'Anuluj',
    close: 'Zamknij',
    save: 'Zapisz',
    delete: 'Usuń',
    edit: 'Edytuj',
    archive: 'Archiwizuj',
    unarchive: 'Odzyskaj',
    update: 'Aktualizuj',
    add: 'Dodaj',
    confirm: 'Potwierdź',
  },
  badges: {
    archive: {
      archived: 'Archiwum',
      active: 'Aktywne',
    },
  },
  tabs: {
    archiveFilters: {
      active: 'Aktywne',
      archived: 'Zarchiwizowane',
    },
  },
  notifications: {
    save: {
      success: 'Zapisano pomyślnie',
      error: 'Wystąpił błąd podczas zapisywania',
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
  },
  pagination: {
    itemsPerPage: 'Elementów na stronę',
    showNthToNthOf: 'Pokazano %{from} - %{to} ze %{total}',
    pageNthOfTotal: 'Strona %{page} z %{total}',
    searchPlaceholder: 'Szukaj...',
    goto: {
      firstPage: 'Pierwsza strona',
      previousPage: 'Poprzednia strona',
      nextPage: 'Następna strona',
      lastPage: 'Ostatnia strona',
    },
  },
  table: {
    columns: {
      id: 'ID',
      name: 'Nazwa',
      email: 'E-mail',
      status: 'Status',
      createdAt: 'Utworzono',
      updatedAt: 'Zaktualizowano',
      actions: 'Akcje',
    },
  },
  navigation: {
    links: {
      home: 'Podsumowanie',
      organizations: 'Organizacje',
      users: 'Użytkownicy',
      s3: 'S3',
    },
    loggedIn: {
      logout: 'Wyloguj się',
    },
  },
  placeholders: {
    noItemsFound: 'Nie znaleziono żadnych elementów',
  },
  modules: {
    organizations: {
      form: {
        title: {
          edit: 'Edytuj organizację',
          create: 'Utwórz organizację',
        },
        fields: {
          name: {
            label: 'Nazwa',
            placeholder: 'Wpisz nazwę organizacji',
          },
          maxNumberOfUsers: {
            label: 'Maksymalna liczba użytkowników',
            placeholder: 'Wpisz maksymalną liczbę użytkowników',
          },
        },
      },
    },
    users: {
      form: {
        title: {
          edit: 'Edytuj użytkownika',
          create: 'Utwórz użytkownika',
        },
        fields: {
          email: {
            label: 'E-mail',
            placeholder: 'Wpisz adres e-mail',
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
    home: {
      meta: {
        title: 'Podsumowanie',
        description: 'Podsumowanie twojego konta',
      },
      title: 'Strona główna',
    },
    organizations: {
      meta: {
        title: 'Organizacje',
        description: 'Zarządzaj organizacjami',
      },
      title: 'Zarządzaj organizacjami',
    },
    users: {
      meta: {
        title: 'Użytkownicy',
        description: 'Zarządzaj użytkownikami',
      },
      title: 'Zarządzaj użytkownikami',
    },
    s3: {
      meta: {
        title: 'S3',
        description: 'Zarządzaj plikami S3',
      },
      title: 'Zarządzaj plikami S3',
    },
  },
};
