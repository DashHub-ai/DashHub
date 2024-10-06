import type { GetAllObjectPaths } from '@under-control/core';
import type { ControlValue } from '@under-control/inputs';

import { error, type PathValidator } from '@under-control/validate';

import {
  isNil,
  isObjectWithFakeID,
  isRelaxedObjectWithID,
  type ReplaceFnReturnType,
} from '@llm/commons';

type RequiredHookAttrs = {
  messages: {
    required: string;
  };
};

type PredRefineFn<
  V extends ControlValue,
  P extends GetAllObjectPaths<V>,
> = ReplaceFnReturnType<PathValidator<V, P>['fn'], boolean>;

export function isRequiredFieldFilled(value: unknown) {
  return value !== '' && !isNil(value);
}

export function useRequiredFormValidators<V extends ControlValue>({
  messages,
}: RequiredHookAttrs) {
  const requiredPathByPred = <P extends GetAllObjectPaths<V>>(
    path: P,
    predFn: PredRefineFn<V, P>,
  ): PathValidator<V, P> => ({
    path,
    fn: (attrs) => {
      if (predFn(attrs)) {
        return error(messages.required, null, path);
      }
    },
  });

  const required = <P extends GetAllObjectPaths<V>>(
    path: P,
    refineFn?: PredRefineFn<V, P>,
  ): PathValidator<V, P> =>
    requiredPathByPred(
      path,
      attrs => !isRequiredFieldFilled(attrs.value) || !!refineFn?.(attrs),
    );

  const requiredListItem = <P extends GetAllObjectPaths<V>>(
    path: P,
    refineFn?: PredRefineFn<V, P>,
  ): PathValidator<V, P> =>
    requiredPathByPred(
      path,
      attrs => !isRelaxedObjectWithID(attrs.value) || isObjectWithFakeID(attrs.value) || !!refineFn?.(attrs),
    );

  return {
    requiredPathByPred,
    required,
    requiredListItem,
  };
}
