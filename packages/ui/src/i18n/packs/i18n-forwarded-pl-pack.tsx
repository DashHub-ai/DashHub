import type { SdkTranslatedErrors } from '@llm/sdk';

import type { I18N_FORWARDED_EN_PACK } from './i18n-forwarded-en-pack';

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

export const I18N_FORWARDED_PL_PACK: typeof I18N_FORWARDED_EN_PACK = {
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
    alerts: {
      saveSuccess: 'Pomyślnie zapisano zmiany!',
      saveError: 'Nie udało się zapisać zmian!',
    },
  },
  buttons: {
    edit: 'Edytuj',
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
};
