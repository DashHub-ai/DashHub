import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/function';
import { inject, injectable } from 'tsyringe';

import type { SdkJwtTokenRoleSpecificT, SdkJwtTokenT } from '@llm/sdk';
import type { TableId } from '~/modules/database';

import { ConfigService } from '~/modules/config';
import { UsersRepo } from '~/modules/users/users.repo';

import { encodeToken, generateRefreshToken } from '../tokens';

@injectable()
export class AuthJWTService {
  constructor(
    @inject(ConfigService) private readonly configService: ConfigService,
    @inject(UsersRepo) private readonly usersRepo: UsersRepo,
  ) {}

  refreshToken = (refreshToken: string) =>
    pipe(
      this.usersRepo.findByRefreshToken({
        refreshToken,
      }),
      TE.chain(({ id }) => this.generateJWTTokensByUserId(id)),
    );

  generateJWTTokensByUserId = (userId: TableId) => pipe(
    this.generateUserRefreshToken(userId),
    TE.chain(() => this.usersRepo.findWithRelationsById({
      id: userId,
    })),
    TE.map(({ email, organization, role, jwtRefreshToken }) => {
      const { jwt } = this.configService.config.auth;

      const jwtRoleSpecific: SdkJwtTokenRoleSpecificT = (() => {
        switch (role) {
          case 'root':
            return {
              role: 'root',
            };

          default:
            return {
              role: 'user',
              organization: {
                id: organization!.id,
                name: organization!.name,
                role: organization!.role,
              },
            };
        }
      })();

      const jwtToken: SdkJwtTokenT = {
        sub: userId,
        iat: Date.now(),
        exp: Date.now() + jwt.expiresIn * 1000,
        email,
        ...jwtRoleSpecific,
      };

      return {
        token: encodeToken(jwtToken, jwt.secret),
        refreshToken: jwtRefreshToken,
        decoded: jwtToken,
      };
    }),
  );

  private generateUserRefreshToken = (userId: TableId) =>
    this.usersRepo.updateJwtRefreshToken({
      id: userId,
      refreshToken: generateRefreshToken(),
    });
}
