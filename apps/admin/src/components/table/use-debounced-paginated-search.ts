import type { Reader } from 'fp-ts/Reader';
import type { TaskEither } from 'fp-ts/TaskEither';
import type { z } from 'zod';

import {
  type ControlChangeValueCallback,
  useControlStrict,
} from '@under-control/inputs';
import { pipe } from 'fp-ts/function';

import type {
  SdkOffsetPaginationInputT,
} from '@llm/sdk';

import { tryOrThrowTE } from '@llm/commons';
import {
  type StateInUrlProps,
  useAsyncValue,
  useDebounceValue,
  useForceRerender,
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
    interceptFilters?: Reader<z.input<Z>, Partial<z.input<Z>>>;
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
  const forceRerender = useForceRerender();
  const urlPagination = useStateInUrl(urlDecoderAttrs);

  const pagination = useControlStrict<z.infer<Z>>({
    onChange: onChangeFilters,
    defaultValue: urlPagination.initialState,
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
      fetchResultsTask(debouncedPagination.value),
      tryOrThrowTE,
    ),
    [deps, forceRerender.revision],
  );

  useUpdateEffect(() => {
    if (storeDataInUrl) {
      urlPagination.shallowAssignState(debouncedPagination.value);
    }
  }, [storeDataInUrl, debouncedPagination.value]);

  return {
    reload: forceRerender.forceRerender,
    result: promise.status === 'success' ? promise.data : null,
    loading: debouncedPagination.loading || promise.status === 'loading',
    pagination,
  };
}
