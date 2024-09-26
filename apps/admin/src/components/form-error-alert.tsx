import * as E from 'fp-ts/lib/Either';

import type { Nullable, TaggedError } from '@llm/commons';

import { useI18n } from '~/i18n';

type Props = {
  result: Nullable<E.Either<TaggedError<string>, unknown>>;
};

export function FormErrorAlert({ result }: Props) {
  const t = useI18n().pack.errors.tagged;

  if (!result || E.isRight(result)) {
    return null;
  }

  return (
    <p className="uk-text-danger uk-text-small uk-text-center" role="alert">
      {(t as Record<string, any>)[result.left.tag] ?? t.SdkServerError}
    </p>
  );
}
