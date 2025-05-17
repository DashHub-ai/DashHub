import * as TE from 'fp-ts/lib/TaskEither';

import {
  createAsyncStreamIterator,
  isSSR,
  type SearchParamsMap,
  TaggedError,
  withSearchParams,
} from '@dashhub/commons';

import {
  type SdkEndpointNotFoundError,
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
  stream?: boolean;
  abortController?: AbortController;
};

export type SdkApiRequestErrors =
  | SdkRequestError
  | SdkServerError
  | SdkUnauthorizedError
  | SdkInvalidRequestError
  | SdkEndpointNotFoundError;

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
  stream,
  abortController,
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
      signal: abortController?.signal,
    });

    if (stream && result.ok && result.body instanceof ReadableStream) {
      return createAsyncStreamIterator(result.body.getReader());
    }

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

  return TE.tryCatch(task, catchApiRequestResponse);
}

export function catchApiRequestResponse<E extends TaggedError<any, any>>(errorResponse: any) {
  const result = isSdkErrorResponseDto(errorResponse)
    ? TaggedError.deserialize(errorResponse.error) as unknown as E
    : new SdkRequestError(errorResponse);

  if (isSSR()) {
    console.warn('Error response:', errorResponse);
  }

  return result;
}
