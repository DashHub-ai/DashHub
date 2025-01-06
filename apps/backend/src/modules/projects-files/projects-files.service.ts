import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { delay, inject, injectable } from 'tsyringe';

import type { SdkJwtTokenT } from '@llm/sdk';

import { type PartialBy, tapTaskEitherTE } from '@llm/commons';

import type { WithAuthFirewall } from '../auth';
import type { TableId, TableUuid } from '../database';

import { PermissionsService } from '../permissions';
import { ProjectsEmbeddingsService } from '../projects-embeddings/projects-embeddings.service';
import { ProjectsRepo } from '../projects/projects.repo';
import { ProjectsService } from '../projects/projects.service';
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
    @inject(ProjectsEmbeddingsService) private readonly projectsEmbeddingsService: ProjectsEmbeddingsService,
    @inject(delay(() => ProjectsService)) private readonly projectsService: Readonly<ProjectsService>,
    @inject(delay(() => PermissionsService)) private readonly permissionsService: Readonly<PermissionsService>,
  ) {}

  asUser = (jwt: SdkJwtTokenT) => new ProjectsFilesFirewall(jwt, this, this.projectsService, this.permissionsService);

  search = this.esSearchRepo.search;

  uploadFile = (
    {
      bucketId,
      projectId,
      messageId,
      ...attrs
    }: PartialBy<UploadFileAttrs, 'bucketId'> & {
      projectId: TableId;
      messageId?: TableUuid;
    },
  ) => {
    return pipe(
      TE.Do,
      TE.bind('bucket', () =>
        bucketId
          ? TE.of({ id: bucketId })
          : this.projectsRepo.getDefaultS3Bucket({ projectId })),
      TE.bindW('s3File', ({ bucket }) => this.s3Service.uploadFile({
        bucketId: bucket.id,
        ...attrs,
      })),
      TE.bindW('projectFile', ({ s3File }) => this.projectsFilesRepo.create({
        value: {
          projectId,
          messageId,
          s3ResourceId: s3File.id,
        },
      })),
      tapTaskEitherTE(({ projectFile, s3File }) => this.projectsEmbeddingsService.generateFileEmbeddings({
        buffer: attrs.buffer,
        mimeType: attrs.mimeType,
        projectFileId: projectFile.id,
        fileName: attrs.fileName,
        fileUrl: s3File.publicUrl,
      })),
      tapTaskEitherTE(() => this.projectsFilesEsIndexRepo.reindexAllProjectFiles(projectId)),
      TE.map(({ projectFile }) => projectFile),
    );
  };

  deleteByProjectResource = (
    {
      resourceId,
      projectId,
    }: {
      resourceId: TableId;
      projectId: TableId;
    },
  ) => pipe(
    this.projectsFilesRepo.findOne({
      where: [
        ['s3ResourceId', '=', resourceId],
        ['projectId', '=', projectId],
      ],
    }),
    tapTaskEitherTE(() => this.s3Service.deleteFile({
      resourceId,
    })),
    tapTaskEitherTE(({ id }) =>
      this.projectsEmbeddingsService.deleteProjectFileEmbeddings(id),
    ),
    tapTaskEitherTE(({ id }) =>
      this.projectsFilesEsIndexRepo.deleteDocument(id, {
        waitForRecordAvailability: true,
      }),
    ),
  );
}
