import * as TE from 'fp-ts/lib/TaskEither';

import {
  isSSR,
  type SearchParamsMap,
  TaggedError,
  withSearchParams,
} from '@llm/commons';

import {
  type SdkInvalidRequestError,
  SdkRequestError,
  type SdkServerError,
  type SdkUnauthorizedError,
} from '../errors';
import { isSdkErrorResponseDto } from '../response';

export type APIRequestAttrs = {
  url: string;
  options?: RequestInit;
  authToken?: string;
  query?: SearchParamsMap;
  blob?: boolean;
};

export type SdkApiRequestErrors =
  | SdkRequestError
  | SdkServerError
  | SdkUnauthorizedError
  | SdkInvalidRequestError;

export type SdkApiRequestTE<A, E extends TaggedError<string, any> = never> = TE.TaskEither<
  E | SdkApiRequestErrors,
  A
>;

export function performApiRequest<A, E extends TaggedError<string, any> = never>({
  url,
  query,
  options,
  authToken,
  blob,
}: APIRequestAttrs): SdkApiRequestTE<A, E> {
  const task = async () => {
    if (query) {
      url = withSearchParams(query)(url);
    }

    const headers = {
      ...(!(options?.body instanceof FormData) && {
        'Content-Type': 'application/json',
        ...(!blob && {
          Accept: 'application/json',
        }),
      }),
      ...options?.headers,
      ...(authToken && {
        authorization: `Bearer ${authToken}`,
      }),
    };

    const result = await fetch(url, {
      method: 'GET',
      ...options,
      headers,
    });

    if (blob) {
      if (!result.ok) {
        // eslint-disable-next-line no-throw-literal
        throw {
          data: {
            error: new SdkRequestError(result.status),
          },
        };
      }

      return result.blob();
    }

    const response = await result.json();

    if (isSdkErrorResponseDto(response)) {
      throw response;
    }

    if (!result.ok) {
      throw result;
    }

    return response.data;
  };

  return TE.tryCatch(task, (errorResponse: any) => {
    const result = isSdkErrorResponseDto(errorResponse)
      ? TaggedError.deserialize(errorResponse.error) as unknown as E
      : new SdkRequestError(errorResponse);

    if (isSSR()) {
      console.warn('Error response:', errorResponse);
    }

    return result;
  });
}
