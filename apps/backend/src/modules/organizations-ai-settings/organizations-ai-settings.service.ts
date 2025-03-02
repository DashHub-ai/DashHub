import { inject, injectable } from 'tsyringe';

import { OrganizationsAISettingsRepo } from './organizations-ai-settings.repo';

@injectable()
export class OrganizationsAISettingsService {
  constructor(
    @inject(OrganizationsAISettingsRepo) private readonly organizationsAISettingsRepo: OrganizationsAISettingsRepo,
  ) {}

  getChatContextByOrganizationIdOrNil = this.organizationsAISettingsRepo.getChatContextByOrganizationIdOrNil;
}
