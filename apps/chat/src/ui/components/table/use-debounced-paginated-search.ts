import type { Reader } from 'fp-ts/lib/Reader';
import type { TaskEither } from 'fp-ts/lib/TaskEither';
import type { z } from 'zod';

import {
  type ControlChangeValueCallback,
  useControlStrict,
} from '@under-control/inputs';
import { pipe } from 'fp-ts/lib/function';

import type {
  SdkOffsetPaginationInputT,
} from '@llm/sdk';

import { tryOrThrowTE } from '@llm/commons';
import {
  type StateInUrlProps,
  useAsyncValue,
  useDebounceValue,
  useStateInUrl,
  useUpdateEffect,
} from '@llm/commons-front';

type OffsetPaginationWithPhrase = SdkOffsetPaginationInputT & {
  phrase?: string;
};

export type DebouncedPaginatedSearchAttrs<
  Z extends z.ZodType<OffsetPaginationWithPhrase>,
  R,
> =
  & StateInUrlProps<Z>
  & {
    storeDataInUrl?: boolean;
    fetchResultsTask: (filters: z.infer<Z>) => TaskEither<any, R>;
    interceptFilters?: Reader<z.infer<Z>, Partial<z.infer<Z>>>;
    onChangeFilters?: ControlChangeValueCallback<z.infer<Z>>;
  };

export function useDebouncedPaginatedSearch<
  Z extends z.ZodType<any>,
  R,
>(
  {
    storeDataInUrl = true,
    interceptFilters,
    fetchResultsTask,
    onChangeFilters,
    ...urlDecoderAttrs
  }: z.infer<Z> extends SdkOffsetPaginationInputT ? DebouncedPaginatedSearchAttrs<Z, R> : never,
) {
  const urlPagination = useStateInUrl(urlDecoderAttrs);

  const pagination = useControlStrict<z.infer<Z> & { __revision?: number; }>({
    onChange: onChangeFilters,
    defaultValue: {
      ...urlPagination.initialState,
      __revision: 0,
    },
  });

  const debouncedPagination = useDebounceValue(
    {
      delay: 200,
      shouldSetInstantlyIf: (prevValue, value) =>
        prevValue.phrase === value.phrase,
    },
    {
      ...pagination.value,
      ...interceptFilters?.(pagination.value),
    },
    pagination.value,
  );

  const deps = JSON.stringify(debouncedPagination.value);
  const promise = useAsyncValue(
    pipe(
      fetchResultsTask({
        ...debouncedPagination.value,
        __revision: undefined,
      }),
      tryOrThrowTE,
    ),
    [deps],
  );

  const reload = () => {
    pagination.setValue({
      value: {
        ...pagination.value,
        __revision: Date.now(),
      },
    });
  };

  const reset = () => {
    const { initialState } = urlPagination;

    pagination.setValue({
      value: {
        offset: 0,
        limit: initialState?.limit ?? 10,
        ...'archived' in initialState && {
          archived: false,
        },
        __revision: Date.now(),
      },
    });
  };

  useUpdateEffect(() => {
    if (storeDataInUrl) {
      urlPagination.shallowAssignState({
        ...debouncedPagination.value,
        __revision: undefined,
      });
    }
  }, [storeDataInUrl, debouncedPagination.value]);

  return {
    reset,
    silentReload: () => (promise.silentReload as VoidFunction)(),
    reload,
    result: promise.status === 'success' ? promise.data : null,
    loading: debouncedPagination.loading || promise.status === 'loading',
    pagination,
  };
}
