import { flow } from 'fp-ts/lib/function';

import type { SdkJwtTokenT } from '@llm/sdk';

import { AuthFirewallService } from '~/modules/auth/firewall';

import type { ProjectsEmbeddingsService } from './projects-embeddings.service';

export class ProjectsEmbeddingsFirewall extends AuthFirewallService {
  constructor(
    jwt: SdkJwtTokenT,
    private readonly projectsEmbeddingsService: ProjectsEmbeddingsService,
  ) {
    super(jwt);
  }

  search = flow(
    this.projectsEmbeddingsService.search,
    this.tryTEIfUser.is.root,
  );
}
