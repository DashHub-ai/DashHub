import type {
  DecodeTokenFormatError,
  NoTokensInStorageError,
  SdkIncorrectUsernameOrPasswordError,
  SdkInvalidJwtTokenError,
  SdkPayloadValidationError,
  SdkRequestError,
  SdkServerError,
  SdkUnauthorizedError,
} from '@llm/sdk';

export type SdkTranslatedErrors =
  | SdkIncorrectUsernameOrPasswordError
  | DecodeTokenFormatError
  | NoTokensInStorageError
  | SdkPayloadValidationError
  | SdkRequestError
  | SdkServerError
  | SdkUnauthorizedError
  | SdkInvalidJwtTokenError;

const I18N_SDK_ERRORS_EN: Record<SdkTranslatedErrors['tag'], string> = {
  SdkIncorrectUsernameOrPasswordError: 'Incorrect email or password',
  DecodeTokenFormatError: 'Token format is incorrect',
  SdkPayloadValidationError: 'Payload validation error',
  SdkRequestError: 'Request error',
  SdkServerError: 'Server error',
  SdkUnauthorizedError: 'Unauthorized',
  SdkInvalidJwtTokenError: 'Invalid or missing JWT token',
};

export const I18N_PACK_EN = {
  validation: {
    required: 'This field is required',
    invalidEmail: 'This field must be an email address',
  },
  errors: {
    tagged: I18N_SDK_ERRORS_EN,
  },
  navigation: {
    links: {
      home: 'Overview',
      organizations: 'Organizations',
      users: 'Users',
      s3: 'S3',
    },
    loggedIn: {
      logout: 'Logout',
    },
  },
  placeholders: {
    noItemsFound: 'No items found',
  },
  routes: {
    shared: {
      meta: {
        title: 'DashHub Admin',
      },
    },
    login: {
      meta: {
        title: 'Login',
        description: 'Login to your account',
      },
      emailStep: {
        title: 'Login',
        description: 'Enter your email below to login to your account',
        email: 'Email address',
      },
      passwordStep: {
        title: 'Login',
        description: 'Enter your password below to login to your account',
        email: 'Email address',
        password: 'Password',
        remember: 'Remember me',
      },
      orContinueWith: 'Or continue with',
      cta: {
        loginUsingEmail: 'Login using Email',
        loginUsingPassword: 'Login using Password',
      },
      terms: {
        phrase: 'By clicking continue, you agree to our %{terms} and %{privacy}.',
        terms: 'Terms of Service',
        privacy: 'Privacy Policy',
      },
    },
    home: {
      meta: {
        title: 'Overview',
        description: 'Overview of your account',
      },
      title: 'Summary',
    },
    organizations: {
      meta: {
        title: 'Organizations',
        description: 'Manage organizations',
      },
      title: 'Manage organizations',
    },
    users: {
      meta: {
        title: 'Users',
        description: 'Manage users',
      },
      title: 'Manage users',
    },
    s3: {
      meta: {
        title: 'S3 Buckets',
        description: 'Manage S3 buckets',
      },
      title: 'Manage S3 buckets',
    },
  },
};
