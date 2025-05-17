import type { GetAllObjectPaths } from '@under-control/core';
import type { ControlValue } from '@under-control/inputs';

import { error, type PathValidator } from '@under-control/validate';

import { format } from '@dashhub/commons';

type NumericHookAttrs = {
  messages: {
    mustBeLargerThan: string;
  };
};

export function useNumericFormValidator<V extends ControlValue>(
  {
    messages,
  }: NumericHookAttrs,
) {
  const mustBeLargerThan = (minValue: number) => <P extends GetAllObjectPaths<V>>(path: P): PathValidator<V, P> => ({
    path,
    fn: ({ value }) => {
      if (Number(value) <= minValue) {
        return error(
          format(messages.mustBeLargerThan, { number: Number(value ?? 0) }),
          null,
          path,
        );
      }
    },
  });

  return {
    mustBeLargerThan,
    positive: mustBeLargerThan(0),
  };
}
