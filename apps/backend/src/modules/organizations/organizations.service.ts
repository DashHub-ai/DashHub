import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { delay, inject, injectable } from 'tsyringe';

import type {
  SdkCreateOrganizationInputT,
  SdkJwtTokenT,
  SdkTableRowIdT,
  SdkUpdateOrganizationInputT,
} from '@llm/sdk';

import type { WithAuthFirewall } from '../auth';
import type { TableRowWithId } from '../database';

import { AIModelsService } from '../ai-models';
import { AppsService } from '../apps';
import { PermissionsService } from '../permissions';
import { ProjectsService } from '../projects';
import { UsersService } from '../users';
import { OrganizationsEsIndexRepo } from './elasticsearch';
import { OrganizationsEsSearchRepo } from './elasticsearch/organizations-es-search.repo';
import { OrganizationsFirewall } from './organizations.firewall';
import { OrganizationsRepo } from './organizations.repo';
import { OrganizationsS3BucketsService } from './s3-buckets';
import { OrganizationsUsersRepo } from './users/organizations-users.repo';

@injectable()
export class OrganizationsService implements WithAuthFirewall<OrganizationsFirewall> {
  constructor(
    @inject(OrganizationsRepo) private readonly repo: OrganizationsRepo,
    @inject(OrganizationsEsSearchRepo) private readonly esSearchRepo: OrganizationsEsSearchRepo,
    @inject(OrganizationsEsIndexRepo) private readonly esIndexRepo: OrganizationsEsIndexRepo,
    @inject(OrganizationsUsersRepo) private readonly organizationsUsersRepo: OrganizationsUsersRepo,
    @inject(PermissionsService) private readonly permissionsService: PermissionsService,
    @inject(delay(() => UsersService)) private readonly usersService: Readonly<UsersService>,
    @inject(delay(() => ProjectsService)) private readonly projectsService: Readonly<ProjectsService>,
    @inject(delay(() => AppsService)) private readonly appsService: Readonly<AppsService>,
    @inject(delay(() => AIModelsService)) private readonly aiModelsService: Readonly<AIModelsService>,
    @inject(delay(() => OrganizationsS3BucketsService))
    private readonly orgsS3BucketsService: Readonly<OrganizationsS3BucketsService>,
  ) {}

  asUser = (jwt: SdkJwtTokenT) => new OrganizationsFirewall(jwt, this, this.permissionsService);

  unarchive = (id: SdkTableRowIdT) => pipe(
    this.repo.unarchive({ id }),
    TE.tap(() => this.esIndexRepo.findAndIndexDocumentById(id)),
  );

  archive = (id: SdkTableRowIdT) => pipe(
    TE.sequenceArray([
      TE.fromTask(
        pipe(
          this.organizationsUsersRepo.createOrganizationUsersIdsIterator({
            organizationId: id,
          }),
          this.usersService.archiveSeqStream,
        ),
      ),
      this.projectsService.archiveSeqByOrganizationId(id),
      this.appsService.archiveSeqByOrganizationId(id),
      this.orgsS3BucketsService.archiveSeqByOrganizationId(id),
      this.aiModelsService.archiveSeqByOrganizationId(id),
    ]),
    TE.chain(() => this.repo.archive({ id })),
    TE.tap(() => this.esIndexRepo.findAndIndexDocumentById(id)),
  );

  get = this.esSearchRepo.get;

  search = this.esSearchRepo.search;

  create = (value: SdkCreateOrganizationInputT) => pipe(
    this.repo.create({ value }),
    TE.tap(({ id }) => this.esIndexRepo.findAndIndexDocumentById(id)),
  );

  update = ({ id, ...value }: SdkUpdateOrganizationInputT & TableRowWithId) => pipe(
    this.repo.update({ id, value }),
    TE.tap(() => this.esIndexRepo.findAndIndexDocumentById(id)),
  );
}
