import type { SdkErrorResponseT } from './sdk-error-response.dto';
import type { SdkSuccessResponseT } from './sdk-success-response.dto';

export type SdkResponseT<D> = SdkSuccessResponseT<D> | SdkErrorResponseT;
