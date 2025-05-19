import type { Reader } from 'fp-ts/lib/Reader';

import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';

import {
  createAccessLevelGuard,
  ofSdkUnauthorizedErrorTE,
  type SdkAccessLevelGuards,
  type SdkJwtTokenT,
  type SdkOrganizationUserRoleT,
  type SdkUnauthorizedError,
  type SdkUserRoleT,
} from '@dashhub/sdk';

/**
 * Returns unauthorized status BEFORE task either execution when assert fails
 */
export function tryTaskEitherIfUser(token: SdkJwtTokenT) {
  const check = createAccessLevelGuard(token);
  const isAuthorizedAttrs: IsAuthorizedReaderAttrs = {
    token,
    check,
  };

  const satisfies
    = (isAuthorizedFn: Reader<IsAuthorizedReaderAttrs, boolean>) =>
      <A, E>(
        task: TE.TaskEither<E, A>,
      ): TE.TaskEither<E | SdkUnauthorizedError, A> =>
        check.is.root || isAuthorizedFn(isAuthorizedAttrs)
          ? task
          : ofSdkUnauthorizedErrorTE();

  const satisfiesTE
    = <E2>(
      isAuthorizedFn: Reader<
        IsAuthorizedReaderAttrs,
        TE.TaskEither<E2, boolean>
      >,
    ) =>
      <A, E>(task: TE.TaskEither<E, A>) =>
        pipe(
          check.is.root ? TE.of(true) : isAuthorizedFn(isAuthorizedAttrs),
          TE.mapLeft(ofSdkUnauthorizedErrorTE),
          TE.chainW(
            result =>
              (result ? task : ofSdkUnauthorizedErrorTE()) as TE.TaskEither<
                E | E2 | SdkUnauthorizedError,
                A
              >,
          ),
        );

  const oneOfRole
    = (...types: SdkUserRoleT[]) =>
      <A, E>(task: TE.TaskEither<E, A>) =>
        pipe(
          task,
          satisfies(() => types.includes(token.role)),
        );

  const isOfRole
    = (type: SdkUserRoleT) =>
      <A, E>(task: TE.TaskEither<E, A>) =>
        pipe(
          task,
          satisfies(() => token.role === type),
        );

  const isOfOrganizationRole
    = (type: SdkOrganizationUserRoleT) =>
      <A, E>(task: TE.TaskEither<E, A>) =>
        pipe(
          task,
          satisfies(() => token.role === 'user' && token.organization.role === type),
        );

  const oneOfOrganizationRole
    = (...types: SdkOrganizationUserRoleT[]) =>
      <A, E>(task: TE.TaskEither<E, A>) =>
        pipe(
          task,
          satisfies(() => token.role === 'user' && types.includes(token.organization.role)),
        );

  const is = {
    // General roles
    ...{
      root: isOfRole('root'),
      user: isOfRole('user'),
    } satisfies Record<SdkUserRoleT, Function>,

    // Organization roles
    organization: {
      owner: isOfOrganizationRole('owner'),
      member: isOfOrganizationRole('member'),
      tech: isOfOrganizationRole('tech'),
    } satisfies Record<SdkOrganizationUserRoleT, Function>,
  };

  return {
    is,
    authorized: satisfies(() => true),
    satisfies,
    satisfiesTE,
    oneOfRole,
    isOfRole,
    isOfOrganizationRole,
    oneOfOrganizationRole,
  };
}

type IsAuthorizedReaderAttrs = {
  token: SdkJwtTokenT;
  check: SdkAccessLevelGuards;
};
