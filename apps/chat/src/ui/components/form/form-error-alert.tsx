import type * as E from 'fp-ts/lib/Either';

import type { Nullable, TaggedError } from '@dashhub/commons';

import { useSdkErrorTranslator } from '~/hooks';

type Props = {
  result: Nullable<E.Either<TaggedError<string>, unknown>>;
};

export function FormErrorAlert({ result }: Props) {
  const message = useSdkErrorTranslator().translateEither(result);

  if (!message) {
    return null;
  }

  return (
    <p className="uk-text-danger uk-text-small uk-text-center" role="alert">
      {message}
    </p>
  );
}
