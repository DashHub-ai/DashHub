import * as E from 'fp-ts/lib/Either';

import type { Nullable, TaggedError } from '@llm/commons';

import { useForwardedI18n } from '~/i18n';

import { FormErrorAlert } from '../form';
import { AlertBox } from './alert-box';

type Props = {
  result: Nullable<E.Either<TaggedError<string>, unknown>>;
};

export function FormAlertBoxes({ result }: Props) {
  const t = useForwardedI18n().pack.form.alerts;

  if (!result) {
    return null;
  }

  return (
    <>
      {E.isRight(result) && (
        <AlertBox variant="success" className="mb-4">
          {t.saveSuccess}
        </AlertBox>
      )}

      {E.isLeft(result) && (
        <AlertBox variant="error" className="mb-4">
          {t.saveError}
          <br />
          <FormErrorAlert result={result} />
        </AlertBox>
      )}
    </>
  );
}
