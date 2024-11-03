import type {
  SdkDecodeTokenFormatError,
  SdkIncorrectUsernameOrPasswordError,
  SdkInvalidJwtTokenError,
  SdkNoTokensInStorageError,
} from './modules';
import type {
  SdkEndpointNotFoundError,
  SdkInvalidRequestError,
  SdkPayloadValidationError,
  SdkRecordAlreadyExistsError,
  SdkRecordNotFoundError,
  SdkRequestError,
  SdkServerError,
  SdkUnauthorizedError,
} from './shared';

export type SdkTranslatedErrors =
  | SdkIncorrectUsernameOrPasswordError
  | SdkDecodeTokenFormatError
  | SdkNoTokensInStorageError
  | SdkPayloadValidationError
  | SdkRequestError
  | SdkServerError
  | SdkUnauthorizedError
  | SdkInvalidJwtTokenError
  | SdkRecordAlreadyExistsError
  | SdkRecordNotFoundError
  | SdkEndpointNotFoundError
  | SdkInvalidRequestError;
