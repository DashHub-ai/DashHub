import type { z } from 'zod';

import { pipe } from 'fp-ts/function';
import { useState } from 'react';

import {
  decodeSearchParams,
  type SearchParamsMap,
  tryOrThrowEither,
  tryParseUsingZodSchema,
  withSearchParams,
} from '@llm/commons';

import { useVanillaHistory } from './use-vanilla-history';

export type StateInUrlProps<T extends z.ZodType<any>> = {
  schema: T;
  serializeSearchParams?: (state: z.infer<T>) => SearchParamsMap;
  fallbackSearchParams: z.input<T>;
};

export function useStateInUrl<T extends z.ZodType<any>>({
  schema,
  serializeSearchParams,
  fallbackSearchParams,
}: StateInUrlProps<T>) {
  const vanilla = useVanillaHistory();

  const readState = () => pipe(
    {
      ...fallbackSearchParams,
      ...decodeSearchParams(location.search),
    },
    tryParseUsingZodSchema(schema),
    tryOrThrowEither((err) => {
      console.error(err.context);
      return new Error('Malformed search params!');
    }),
  );

  const [initialState] = useState<z.infer<T>>(readState);

  const shallowAssignState = (state: z.infer<T>) => {
    const maybeEncodedState = serializeSearchParams?.(state) ?? state;
    const newUrl = withSearchParams(maybeEncodedState)(location.pathname);

    vanilla.replaceState(newUrl, null);
  };

  return {
    initialState,
    shallowAssignState,
  };
}
