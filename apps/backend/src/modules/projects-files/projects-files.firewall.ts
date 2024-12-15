import { flow } from 'fp-ts/lib/function';

import type { SdkJwtTokenT } from '@llm/sdk';

import { AuthFirewallService } from '~/modules/auth/firewall';

import type { ProjectsFilesService } from './projects-files.service';

export class ProjectsFilesFirewall extends AuthFirewallService {
  constructor(
    jwt: SdkJwtTokenT,
    private readonly projectsFilesService: ProjectsFilesService,
  ) {
    super(jwt);
  }

  uploadFile = flow(
    this.projectsFilesService.uploadFile,
    this.tryTEIfUser.is.root,
  );
}
