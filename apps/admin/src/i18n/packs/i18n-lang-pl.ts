import deepmerge from 'deepmerge';

import type { SdkAIProviderT, SdkOrganizationUserRoleT, SdkUserRoleT } from '@llm/sdk';

import { I18N_FORWARDED_PL_PACK } from '@llm/ui';

import type { I18nLangPack } from './i18n-packs';

const I18N_AI_PROVIDERS_PL: Record<SdkAIProviderT, string> = {
  openai: 'OpenAI',
};

const I18N_USER_ROLES_PL: Record<SdkUserRoleT, string> = {
  root: 'Root',
  user: 'Użytkownik',
};

const I18N_USER_ORGANIZATION_ROLES_PL: Record<SdkOrganizationUserRoleT, string> = {
  owner: 'Właściciel',
  tech: 'Użytkownik techniczny',
  member: 'Użytkownik',
};

export const I18N_PACK_PL: I18nLangPack = deepmerge(I18N_FORWARDED_PL_PACK, {
  common: {
    email: 'E-mail',
    password: 'Hasło',
  },
  table: {
    columns: {
      id: 'ID',
      name: 'Nazwa',
      description: 'Opis',
      auth: 'Autoryzacja',
      organization: 'Organizacja',
      parentCategory: 'Kategoria nadrzędna',
      active: 'Aktywny',
      email: 'E-mail',
      archived: 'Archiwum',
      createdAt: 'Utworzono',
      updatedAt: 'Zaktualizowano',
      actions: 'Akcje',
    },
  },
  navigation: {
    groups: {
      resources: 'Zasoby',
      development: 'Rozwój',
      aiAndStorage: 'AI i Storage',
    },
    links: {
      home: 'Podsumowanie',
      organizations: 'Organizacje',
      users: 'Użytkownicy',
      s3Buckets: 'S3',
      projects: 'Projekty',
      apps: 'Aplikacje',
      appsCategories: 'Kategorie aplikacji',
      aiModels: 'Modele AI',
    },
    loggedIn: {
      logout: 'Wyloguj się',
    },
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
          description: {
            label: 'Opis',
            placeholder: 'Wpisz opis projektu',
            generated: 'Wygenerowany przez AI',
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
          category: {
            label: 'Kategoria',
          },
          description: {
            label: 'Opis',
            placeholder: 'Wpisz opis aplikacji',
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
    appsCategories: {
      prefix: {
        category: 'Kategoria',
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
    },
    aiModels: {
      providers: I18N_AI_PROVIDERS_PL,
      prefix: {
        app: 'Model AI',
      },
      table: {
        columns: {
          defaultForOrganization: 'Domyślny dla organizacji',
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
          name: {
            label: 'Imię i nazwisko',
            placeholder: 'Wpisz imię i nazwisko',
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
      sections: {
        resources: {
          title: 'Zasoby',
          cards: {
            organizations: {
              title: 'Organizacje',
              description: 'Twórz i zarządzaj organizacjami, konfiguruj ich ustawienia i kontroluj uprawnienia dostępu. Konfiguruj rozliczenia, struktury zespołów i polityki organizacyjne.',
            },
            users: {
              title: 'Użytkownicy',
              description: 'Zarządzaj kontami użytkowników, rolami i uprawnieniami w całej platformie. Monitoruj aktywność użytkowników, zarządzaj ustawieniami uwierzytelniania i utrzymuj protokoły bezpieczeństwa.',
            },
          },
        },
        development: {
          title: 'Narzędzia deweloperskie',
          cards: {
            apps: {
              title: 'Aplikacje',
              description: 'Uzyskaj dostęp i zarządzaj portfolio aplikacji. Wdrażaj, monitoruj i konfiguruj aplikacje. Śledź metryki wydajności i zarządzaj cyklem życia aplikacji.',
            },
            appsCategories: {
              title: 'Kategorie aplikacji',
              description: 'Organizuj aplikacje w logiczne kategorie dla lepszego zarządzania. Twórz struktury hierarchiczne i utrzymuj przejrzystą taksonomię aplikacji.',
            },
            projects: {
              title: 'Projekty',
              description: 'Nadzoruj projekty rozwojowe od powstania do wdrożenia. Śledź postęp projektu, zarządzaj zasobami i efektywnie koordynuj pracę zespołu.',
            },
          },
        },
        aiAndStorage: {
          title: 'AI i przechowywanie',
          cards: {
            aiModels: {
              title: 'Modele AI',
              description: 'Wdrażaj i zarządzaj modelami AI/ML w produkcji. Monitoruj wydajność modeli, kontroluj wersje i efektywnie zarządzaj cyklem życia modeli.',
            },
            s3Buckets: {
              title: 'Kubełki S3',
              description: 'Zarządzaj kubełkami w chmurze dla swoich aplikacji. Konfiguruj polityki dostępu, monitoruj wykorzystanie pamięci i optymalizuj strategie zarządzania danymi.',
            },
          },
        },
      },
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
    appsCategories: {
      meta: {
        title: 'Kategorie aplikacji',
        description: 'Zarządzaj kategoriami aplikacji',
      },
      title: 'Zarządzaj kategoriami aplikacji',
    },
    aiModels: {
      meta: {
        title: 'Modele AI',
        description: 'Zarządzaj modelami AI',
      },
      title: 'Zarządzaj modelami AI',
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
});
