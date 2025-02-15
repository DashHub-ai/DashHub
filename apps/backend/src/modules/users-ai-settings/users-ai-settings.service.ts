import { inject, injectable } from 'tsyringe';

import { UsersAISettingsRepo } from './users-ai-settings.repo';

@injectable()
export class UsersAISettingsService {
  constructor(
    @inject(UsersAISettingsRepo) private readonly usersAISettingsRepo: UsersAISettingsRepo,
  ) {}

  getChatContextByUserId = this.usersAISettingsRepo.getChatContextByUserId;
}
