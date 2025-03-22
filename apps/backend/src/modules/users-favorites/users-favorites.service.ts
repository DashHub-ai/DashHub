import { delay, inject, injectable } from 'tsyringe';

import type { SdkJwtTokenT } from '@llm/sdk';

import { AppsService } from '../apps';
import { ChatsService } from '../chats';
import { PermissionsService } from '../permissions';
import { UsersFavoritesFirewall } from './users-favorites.firewall';
import { UsersFavoritesRepo } from './users-favorites.repo';

@injectable()
export class UsersFavoritesService {
  constructor(
    @inject(UsersFavoritesRepo) private readonly usersFavoritesRepo: UsersFavoritesRepo,
    @inject(PermissionsService) private readonly permissionsService: PermissionsService,
    @inject(delay(() => ChatsService)) private readonly chatsService: Readonly<ChatsService>,
    @inject(delay(() => AppsService)) private readonly appsService: Readonly<AppsService>,
  ) {}

  asUser = (jwt: SdkJwtTokenT) => new UsersFavoritesFirewall(
    jwt,
    this,
    this.permissionsService,
    this.chatsService,
    this.appsService,
  );

  upsert = this.usersFavoritesRepo.upsert;

  delete = this.usersFavoritesRepo.delete;

  findAll = this.usersFavoritesRepo.findAll;
}
