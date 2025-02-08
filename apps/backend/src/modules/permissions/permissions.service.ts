import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { delay, inject, injectable } from 'tsyringe';

import type { SdkJwtTokenT } from '@llm/sdk';

import { tapTaskEitherTE } from '@llm/commons';

import type { WithAuthFirewall } from '../auth';
import type { TableId } from '../database';

import { AppsEsIndexRepo } from '../apps/elasticsearch';
import { ChatsEsIndexRepo } from '../chats/elasticsearch';
import { ProjectsEsIndexRepo } from '../projects/elasticsearch';
import { UsersGroupsRepo } from '../users-groups';
import { PermissionsFirewall } from './permissions.firewall';
import { PermissionsRepo } from './permissions.repo';

@injectable()
export class PermissionsService implements WithAuthFirewall<PermissionsFirewall> {
  constructor(
    @inject(PermissionsRepo) private readonly repo: PermissionsRepo,
    @inject(UsersGroupsRepo) private readonly usersGroupsRepo: UsersGroupsRepo,
    @inject(delay(() => ProjectsEsIndexRepo)) private readonly projectsEsIndexRepo: Readonly<ProjectsEsIndexRepo>,
    @inject(delay(() => AppsEsIndexRepo)) private readonly appsEsIndexRepo: Readonly<AppsEsIndexRepo>,
    @inject(delay(() => ChatsEsIndexRepo)) private readonly chatsEsIndexRepo: Readonly<ChatsEsIndexRepo>,
  ) {}

  upsert = this.repo.upsert;

  asUser = (jwt: SdkJwtTokenT) => new PermissionsFirewall(jwt, this.usersGroupsRepo);

  deleteUserExternalResourcesPermissions = (userId: TableId) => pipe(
    this.repo.deleteUserExternalResourcesPermissions({ userId }),
    tapTaskEitherTE(({ projectsIds, appsIds, chatsIds }) => TE.sequenceArray([
      this.projectsEsIndexRepo.findAndIndexDocumentsByIds(projectsIds),
      this.appsEsIndexRepo.findAndIndexDocumentsByIds(appsIds),
      this.chatsEsIndexRepo.findAndIndexDocumentsByIds(chatsIds),
    ])),
  );
}
