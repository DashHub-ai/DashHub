import type { GetAllObjectPaths } from '@under-control/core';
import type { ControlValue } from '@under-control/inputs';

import { error, type PathValidator } from '@under-control/validate';

import { EMAIL_REGEX } from '@llm/commons';

type EmailHookAttrs = {
  messages: {
    invalidEmail: string;
  };
};

export function useEmailValidatorFormValidators<V extends ControlValue>({
  messages,
}: EmailHookAttrs) {
  const emailFormatValidator = <P extends GetAllObjectPaths<V>>(
    path: P,
  ): PathValidator<V, P> => ({
    path,
    fn: ({ value }) => {
      if (
        typeof value !== 'string'
        || (typeof value === 'string' && !EMAIL_REGEX.test(value))
      ) {
        return error(messages.invalidEmail, null, path);
      }
    },
  });

  return {
    emailFormatValidator,
  };
}
