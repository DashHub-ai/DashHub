import * as E from 'fp-ts/lib/Either';

import type { Nullable, TaggedError } from '@llm/commons';

import { isSdkTaggedError } from '@llm/sdk';
import { useForwardedI18n } from '~/i18n';

export function useSdkErrorTranslator() {
  const t = useForwardedI18n().pack.errors.tagged;

  const translateEither = (error: Nullable<E.Either<TaggedError<string>, unknown>>) => {
    if (!error || E.isRight(error)) {
      return null;
    }

    return (t as Record<string, any>)[error.left.tag] ?? t.SdkServerError;
  };

  const unsafeTranslate = (error: any): string | null => {
    if (isSdkTaggedError(error)) {
      return translateEither(E.left(error));
    }

    if (error && E.isLeft<any>(error) && isSdkTaggedError(error.left)) {
      return translateEither(error);
    }

    return null;
  };

  return {
    unsafeTranslate,
    translateEither,
  };
}
