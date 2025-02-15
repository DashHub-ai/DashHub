import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import type { SdkCreateUserInputT } from '@llm/sdk';

import { type DistributiveOmit, tapTaskEither, toVoidTE } from '@llm/commons';
import { genRandomToken } from '~/helpers';
import { ConfigService } from '~/modules/config';

import { LoggerService } from '../logger';
import { UsersService } from './users.service';

@injectable()
export class UsersBootService {
  private readonly logger = LoggerService.of('UsersBootService');

  constructor(
    @inject(ConfigService) private readonly configService: ConfigService,
    @inject(UsersService) private readonly usersService: UsersService,
  ) {}

  ensureRootUserExists = () => pipe(
    TE.Do,
    TE.bind('dto', (): TE.TaskEither<unknown, DistributiveOmit<SdkCreateUserInputT, 'avatar'>> => {
      const { configService } = this;
      const { root } = configService.config.users;

      return TE.right({
        role: 'root',
        name: 'Root',
        email: root.email,
        active: true,
        archiveProtection: true,
        aiSettings: {
          chatContext: null,
        },
        auth: {
          email: {
            enabled: false,
          },
          password: {
            enabled: true,
            value: root.password ?? genRandomToken(10),
          },
        },
      });
    }),
    TE.bindW('result', ({ dto }) => this.usersService.createIfNotExists(dto)),
    tapTaskEither(({ dto, result }) => {
      if (result.created) {
        this.logger.info('Created root user!', {
          id: result.id,
          ...dto,
        });
      }
      else {
        this.logger.info('Root user already exists!', {
          id: result.id,
        });
      }
    }),
    toVoidTE,
  );
}
