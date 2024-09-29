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
};

export const I18N_PACK_PL: I18nLangPack = {
  validation: {
    required: 'To pole jest wymagane',
    invalidEmail: 'To pole musi być adresem e-mail',
  },
  errors: {
    tagged: I18N_SDK_ERRORS_PL,
  },
  pagination: {
    itemsPerPage: 'Elementów na stronę',
    showNthToNthOf: 'Pokazano %{from} - %{to} ze %{total}',
    pageNthOfTotal: 'Strona %{page} z %{total}',
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
