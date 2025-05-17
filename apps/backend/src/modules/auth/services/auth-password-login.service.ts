import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import { catchTaskEitherTagError } from '@dashhub/commons';
import { SdkIncorrectUsernameOrPasswordError, type SdkPasswordLoginInputT } from '@dashhub/sdk';
import { UsersRepo } from '~/modules/users';

import { tryComparePasswords } from '../helpers';
import { AuthPasswordsRepo } from '../repo';
import { AuthJWTService } from './auth-jwt.service';

@injectable()
export class AuthPasswordLoginService {
  constructor(
    @inject(UsersRepo) private readonly usersRepo: UsersRepo,
    @inject(AuthPasswordsRepo) private readonly authPasswordsRepo: AuthPasswordsRepo,
    @inject(AuthJWTService) private readonly authJWTService: AuthJWTService,
  ) {}

  login = ({ email, password }: SdkPasswordLoginInputT) => pipe(
    this.usersRepo.isPresentOrThrow({
      email,
    }),
    TE.chainW(() => this.authorizeUserByPasswordOrThrow(
      {
        email,
        password,
      },
    )),
    TE.chainW(({ userId }) =>
      this.authJWTService.generateJWTTokensByUserId(userId),
    ),
    catchTaskEitherTagError('DatabaseRecordNotExists')(() => TE.left(
      new SdkIncorrectUsernameOrPasswordError({
        email,
      }),
    )),
  );

  private readonly authorizeUserByPasswordOrThrow = ({
    email,
    password,
  }: SdkPasswordLoginInputT) =>
    pipe(
      TE.Do,
      TE.bind('hash', () =>
        this.authPasswordsRepo.getPasswordHashByEmail(
          {
            email,
          },
        )),
      TE.bindW('match', ({ hash }) => tryComparePasswords(password)(hash)),
      TE.chainW(({ match, hash }) => {
        if (!match) {
          return TE.left(
            new SdkIncorrectUsernameOrPasswordError({
              email,
            }),
          );
        }

        return TE.of({
          userId: hash.userId,
        });
      }),
    );
}
