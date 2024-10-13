import type { SdkOrganizationUserRoleT, SdkUserRoleT } from '@llm/sdk';

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
  SdkInvalidRequestError: 'Nieprawidłowy format żądania',
};

export const I18N_USER_ROLES_PL: Record<SdkUserRoleT, string> = {
  root: 'Root',
  user: 'Użytkownik',
};

export const I18N_USER_ORGANIZATION_ROLES_PL: Record<SdkOrganizationUserRoleT, string> = {
  owner: 'Właściciel',
  member: 'Pracownik',
};

export const I18N_PACK_PL: I18nLangPack = {
  common: {
    email: 'E-mail',
    password: 'Hasło',
  },
  validation: {
    required: 'To pole jest wymagane',
    invalidEmail: 'To pole musi być adresem e-mail',
    mustBeLargerThan: 'To pole musi być większe niż %{number}',
    password: {
      mustBeLongerThan: 'Hasło musi mieć więcej niż %{number} znaków',
    },
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
    resetFilters: 'Resetuj filtry',
  },
  badges: {
    archive: {
      archived: 'Archiwum',
      active: 'Aktywne',
    },
    boolean: {
      yes: 'Tak',
      no: 'Nie',
    },
  },
  tabs: {
    archiveFilters: {
      all: 'Wszystkie',
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
      auth: 'Autoryzacja',
      organization: 'Organizacja',
      active: 'Aktywny',
      email: 'E-mail',
      archived: 'Archiwum',
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
      s3Buckets: 'S3',
      projects: 'Projekty',
      apps: 'Aplikacje',
    },
    loggedIn: {
      logout: 'Wyloguj się',
    },
  },
  placeholders: {
    selectItem: 'Wybierz element',
    noItemsFound: 'Nie znaleziono żadnych elementów',
    search: 'Szukaj...',
  },
  modules: {
    searchBar: {
      viewAll: 'Wszystkie',
      input: {
        placeholder: 'Szukaj...',
      },
      groups: {
        users: {
          header: 'Użytkownicy',
          itemSubTitle: 'Użytkownik',
        },
        organizations: {
          header: 'Organizacje',
          itemSubTitle: 'Organizacja',
        },
        projects: {
          header: 'Projekty',
          itemSubTitle: 'Projekt',
        },
        apps: {
          header: 'Aplikacje',
          itemSubTitle: 'Aplikacja',
        },
        s3Buckets: {
          header: 'Kubełki S3',
          itemSubTitle: 'Kubełek S3',
        },
      },
    },
    organizations: {
      prefix: {
        organization: 'Organizacja',
      },
      userRoles: I18N_USER_ORGANIZATION_ROLES_PL,
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
    projects: {
      prefix: {
        project: 'Projekt',
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
          organization: {
            label: 'Wybierz organizację',
          },
        },
      },
    },
    apps: {
      prefix: {
        app: 'Aplikacja',
      },
      form: {
        title: {
          create: 'Utwórz aplikację',
          edit: 'Edytuj aplikację',
        },
        fields: {
          name: {
            label: 'Nazwa',
            placeholder: 'Wpisz nazwę aplikacji',
          },
          organization: {
            label: 'Organizacja',
          },
          chatContext: {
            label: 'Kontekst czatu',
            placeholder: 'Wpisz kontekst czatu',
          },
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
          defaultForOrganization: 'Domyślny dla organizacji',
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
        },
      },
    },
    users: {
      roles: I18N_USER_ROLES_PL,
      form: {
        title: {
          edit: 'Edytuj użytkownika',
          create: 'Utwórz użytkownika',
        },
        fields: {
          role: {
            label: 'Rola',
          },
          email: {
            label: 'E-mail',
            placeholder: 'Wpisz adres e-mail',
          },
          flags: {
            label: 'Flagi',
          },
          active: {
            label: 'Aktywny',
          },
          archiveProtection: {
            label: 'Ochrona przed archiwizacją',
          },
          organization: {
            choose: {
              label: 'Organizacja',
            },
            role: {
              label: 'Rola w organizacji',
            },
          },
          auth: {
            label: 'Autoryzacja',
            email: {
              label: 'E-mail',
              placeholder: 'Wpisz adres e-mail',
            },
            password: {
              label: 'Hasło',
              placeholder: 'Wpisz hasło',
            },
            resetPassword: {
              label: 'Resetuj hasło',
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
    projects: {
      meta: {
        title: 'Projekty',
        description: 'Zarządzaj projektami',
      },
      title: 'Zarządzaj projektami',
    },
    apps: {
      meta: {
        title: 'Aplikacje',
        description: 'Zarządzaj aplikacjami',
      },
      title: 'Zarządzaj aplikacjami',
    },
    users: {
      meta: {
        title: 'Użytkownicy',
        description: 'Zarządzaj użytkownikami',
      },
      title: 'Zarządzaj użytkownikami',
    },
    s3Buckets: {
      meta: {
        title: 'S3',
        description: 'Zarządzaj kubełkami S3',
      },
      title: 'Zarządzaj kubełkami S3',
    },
  },
};
