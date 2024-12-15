import type { Buffer } from 'node:buffer';

import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import type { SdkJwtTokenT } from '@llm/sdk';

import type { WithAuthFirewall } from '../auth';
import type { TableId } from '../database';

import { ProjectsRepo } from '../projects/projects.repo';
import { S3Service } from '../s3';
import { ProjectsFilesFirewall } from './projects-files.firewall';

@injectable()
export class ProjectsFilesService implements WithAuthFirewall<ProjectsFilesFirewall> {
  constructor(
    @inject(S3Service) private readonly s3Service: S3Service,
    @inject(ProjectsRepo) private readonly projectsRepo: ProjectsRepo,
  ) {}

  asUser = (jwt: SdkJwtTokenT) => new ProjectsFilesFirewall(jwt, this);

  uploadFile = (
    {
      bucketId,
      projectId,
      buffer,
      fileName,
    }: {
      bucketId?: TableId;
      projectId: TableId;
      buffer: Buffer | string;
      fileName: string;
    },
  ) => pipe(
    bucketId
      ? TE.of({ id: bucketId })
      : this.projectsRepo.getDefaultS3Bucket({ projectId }),
    TE.chainW(bucket => this.s3Service.uploadFile({
      bucketId: bucket.id,
      buffer,
      fileName,
    })),
  );
}
