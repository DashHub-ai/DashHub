import { taskEither as TE } from 'fp-ts';
import { inject, injectable } from 'tsyringe';

import type { TableId } from '../database';
import type { UploadFilePayload } from '../s3';

import { LoggerService } from '../logger';
import { ProjectsEmbeddingsRepo } from './projects-embeddings.repo';

type EmbeddingGeneratorAttrs = {
  buffer: UploadFilePayload;
  mimeType: string;
  projectFileId: TableId;
};

@injectable()
export class ProjectsEmbeddingsService {
  private readonly logger = LoggerService.of('ProjectsEmbeddingsService');

  constructor(
    @inject(ProjectsEmbeddingsRepo) private readonly repo: ProjectsEmbeddingsRepo,
  ) {}

  generateFileEmbeddings(
    {
      buffer,
      mimeType,
      projectFileId,
    }: EmbeddingGeneratorAttrs,
  ) {
    this.logger.info({
      size: buffer.length,
      mimeType,
      projectFileId,
    });

    return TE.of(void 0);
  }
}
