import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import type { SdkJwtTokenT } from '@llm/sdk';

import { type PartialBy, tapTaskEitherTE } from '@llm/commons';

import type { WithAuthFirewall } from '../auth';
import type { TableId } from '../database';

import { ProjectsRepo } from '../projects/projects.repo';
import { S3Service, UploadFileAttrs } from '../s3';
import { ProjectsFilesEsIndexRepo, ProjectsFilesEsSearchRepo } from './elasticsearch';
import { ProjectsFilesFirewall } from './projects-files.firewall';
import { ProjectsFilesRepo } from './projects-files.repo';

@injectable()
export class ProjectsFilesService implements WithAuthFirewall<ProjectsFilesFirewall> {
  constructor(
    @inject(S3Service) private readonly s3Service: S3Service,
    @inject(ProjectsRepo) private readonly projectsRepo: ProjectsRepo,
    @inject(ProjectsFilesRepo) private readonly projectsFilesRepo: ProjectsFilesRepo,
    @inject(ProjectsFilesEsIndexRepo) private readonly projectsFilesEsIndexRepo: ProjectsFilesEsIndexRepo,
    @inject(ProjectsFilesEsSearchRepo) private readonly esSearchRepo: ProjectsFilesEsSearchRepo,
  ) {}

  asUser = (jwt: SdkJwtTokenT) => new ProjectsFilesFirewall(jwt, this);

  search = this.esSearchRepo.search;

  uploadFile = (
    {
      bucketId,
      projectId,
      ...attrs
    }: PartialBy<UploadFileAttrs, 'bucketId'> & {
      projectId: TableId;
    },
  ) => {
    return pipe(
      bucketId
        ? TE.of({ id: bucketId })
        : this.projectsRepo.getDefaultS3Bucket({ projectId }),
      TE.chain(bucket => this.s3Service.uploadFile({
        bucketId: bucket.id,
        ...attrs,
      })),
      tapTaskEitherTE(({ id }) => this.projectsFilesRepo.create({
        projectId,
        s3ResourceId: id,
      })),
      tapTaskEitherTE(() => this.projectsFilesEsIndexRepo.reindexAllProjectFiles(projectId)),
    );
  };

  delete = (
    {
      resourceId,
      projectId,
    }: {
      resourceId: TableId;
      projectId: TableId;
    },
  ) => pipe(
    this.projectsFilesRepo.existsOrThrow({
      resourceId,
      projectId,
    }),
    tapTaskEitherTE(() => this.s3Service.deleteFile({
      resourceId,
    })),
    tapTaskEitherTE(() =>
      this.projectsFilesEsIndexRepo.deleteDocument(resourceId, {
        waitForRecordAvailability: true,
      }),
    ),
  );
}
