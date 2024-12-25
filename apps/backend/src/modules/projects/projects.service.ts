import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import type {
  SdkCreateProjectInputT,
  SdkJwtTokenT,
  SdkTableRowIdT,
  SdkUpdateProjectInputT,
} from '@llm/sdk';

import {
  asyncIteratorToVoidPromise,
  runTaskAsVoid,
  tapAsyncIterator,
  tryOrThrowTE,
} from '@llm/commons';

import type { WithAuthFirewall } from '../auth';
import type { TableId, TableRowWithId } from '../database';

import { ProjectsEsIndexRepo, ProjectsEsSearchRepo } from './elasticsearch';
import { ProjectsFirewall } from './projects.firewall';
import { ProjectsRepo } from './projects.repo';

@injectable()
export class ProjectsService implements WithAuthFirewall<ProjectsFirewall> {
  constructor(
    @inject(ProjectsRepo) private readonly repo: ProjectsRepo,
    @inject(ProjectsEsSearchRepo) private readonly esSearchRepo: ProjectsEsSearchRepo,
    @inject(ProjectsEsIndexRepo) private readonly esIndexRepo: ProjectsEsIndexRepo,
  ) {}

  asUser = (jwt: SdkJwtTokenT) => new ProjectsFirewall(jwt, this);

  get = this.esSearchRepo.get;

  unarchive = (id: SdkTableRowIdT) => pipe(
    this.repo.unarchive({ id }),
    TE.tap(() => this.esIndexRepo.findAndIndexDocumentById(id)),
  );

  archive = (id: SdkTableRowIdT) => pipe(
    this.repo.archive({ id }),
    TE.tap(() => this.esIndexRepo.findAndIndexDocumentById(id)),
  );

  archiveSeqByOrganizationId = (organizationId: SdkTableRowIdT) => TE.fromTask(
    pipe(
      this.repo.createIdsIterator({
        where: [['organizationId', '=', organizationId]],
        chunkSize: 100,
      }),
      this.archiveSeqStream,
    ),
  );

  archiveSeqStream = (stream: AsyncIterableIterator<TableId[]>) => async () =>
    pipe(
      stream,
      tapAsyncIterator<TableId[], void>(async ids =>
        pipe(
          this.repo.archiveRecords({
            where: [
              ['id', 'in', ids],
              ['archived', '=', false],
            ],
          }),
          TE.tap(() => this.esIndexRepo.findAndIndexDocumentsByIds(ids)),
          tryOrThrowTE,
          runTaskAsVoid,
        ),
      ),
      asyncIteratorToVoidPromise,
    );

  search = this.esSearchRepo.search;

  create = ({ internal, organization, ...values }: SdkCreateProjectInputT & { internal?: boolean; }) => pipe(
    this.repo.create({
      value: {
        ...values,
        internal: !!internal,
        organizationId: organization.id,
      },
    }),
    TE.tap(({ id }) => this.esIndexRepo.findAndIndexDocumentById(id)),
  );

  update = ({ id, ...value }: SdkUpdateProjectInputT & TableRowWithId) => pipe(
    this.repo.update({ id, value }),
    TE.tap(() => this.esIndexRepo.findAndIndexDocumentById(id)),
  );
}
