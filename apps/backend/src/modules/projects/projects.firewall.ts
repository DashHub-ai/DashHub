import { flow, pipe } from 'fp-ts/lib/function';

import type { SdkCreateProjectInputT, SdkJwtTokenT } from '@llm/sdk';

import { AuthFirewallService } from '~/modules/auth/firewall';

import type { ProjectsService } from './projects.service';

export class ProjectsFirewall extends AuthFirewallService {
  constructor(
    jwt: SdkJwtTokenT,
    private readonly projectsService: ProjectsService,
  ) {
    super(jwt);
  }

  get = flow(
    this.projectsService.get,
    this.tryTEIfUser.is.root,
  );

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

  create = (dto: SdkCreateProjectInputT) => pipe(
    this.projectsService.create({
      ...dto,
      creator: this.userIdRow,
    }),
    this.tryTEIfUser.is.root,
  );

  search = flow(
    this.projectsService.search,
    this.tryTEIfUser.is.root,
  );
}
