import { inject, injectable } from 'tsyringe';

import { ProjectsPoliciesEsSearchRepo } from './elasticsearch';

@injectable()
export class ProjectsPoliciesService {
  constructor(
    @inject(ProjectsPoliciesEsSearchRepo) private readonly esSearchRepo: ProjectsPoliciesEsSearchRepo,
  ) {}

  getByProjectId = this.esSearchRepo.getByProjectId;
}
