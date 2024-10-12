import { flow } from 'fp-ts/lib/function';

import type { SdkJwtTokenT } from '@llm/sdk';

import { AuthFirewallService } from '~/modules/auth/firewall';

import type { ProjectsService } from './projects.service';

export class ProjectsFirewall extends AuthFirewallService {
  constructor(
    jwt: SdkJwtTokenT,
    private readonly projectsService: ProjectsService,
  ) {
    super(jwt);
  }

  unarchive = flow(
    this.projectsService.unarchive,
    this.tryTEIfUser.is.root,
  );

  archive = flow(
    this.projectsService.archive,
    this.tryTEIfUser.is.root,
  );

  update = flow(
    this.projectsService.update,
    this.tryTEIfUser.is.root,
  );

  create = flow(
    this.projectsService.create,
    this.tryTEIfUser.is.root,
  );

  search = flow(
    this.projectsService.search,
    this.tryTEIfUser.is.root,
  );
}
