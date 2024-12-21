import { nonEmptyArray as NEA, option as O, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import type { TableId } from '../database';
import type { UploadFilePayload } from '../s3';

import { AIModelsService } from '../ai-models';
import { LoggerService } from '../logger';
import { ProjectsFilesRepo } from '../projects-files/projects-files.repo';
import { ProjectsEmbeddingsEsIndexRepo } from './elasticsearch';
import { TextAIEmbeddingGenerator } from './generators';
import { ProjectsEmbeddingsRepo } from './projects-embeddings.repo';
import { ProjectEmbeddingsInsertTableRow } from './projects-embeddings.tables';
import { formatVector } from './utils';

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
    @inject(ProjectsEmbeddingsEsIndexRepo) private readonly esIndexRepo: ProjectsEmbeddingsEsIndexRepo,
    @inject(ProjectsFilesRepo) private readonly projectsFilesRepo: ProjectsFilesRepo,
    @inject(AIModelsService) private readonly aiModelsService: AIModelsService,
    @inject(TextAIEmbeddingGenerator) private readonly textAIEmbeddingGenerator: TextAIEmbeddingGenerator,
  ) {}

  generateFileEmbeddings(
    {
      buffer,
      mimeType,
      projectFileId,
    }: EmbeddingGeneratorAttrs,
  ) {
    this.logger.info('Generating embedding...', {
      size: buffer.length,
      mimeType,
      projectFileId,
    });

    return pipe(
      TE.Do,
      TE.bind('aiModel', () => pipe(
        this.projectsFilesRepo.getFileEmbeddingAIModelId({ id: projectFileId }),
        TE.chainW(aiModel => this.aiModelsService.get(aiModel.id)),
      )),
      TE.bindW('maybeEmbeddings', ({ aiModel }) => {
        const task = (() => {
          switch (mimeType) {
            case 'text/plain':
              return this.textAIEmbeddingGenerator.generate({
                aiModel,
                buffer,
              });

            default:
              return TE.of([]);
          };
        })();

        return pipe(
          task,
          TE.map(NEA.fromArray),
        );
      }),
      TE.chainW(({ maybeEmbeddings, aiModel }) => {
        if (O.isNone(maybeEmbeddings)) {
          return TE.of([]);
        }

        return pipe(
          this.repo.createBulk({
            values: pipe(
              maybeEmbeddings.value,
              NEA.map(({ vector, ...embedding }): ProjectEmbeddingsInsertTableRow => ({
                ...embedding,
                aiModelId: aiModel.id,
                vector: formatVector(vector),
                projectFileId,
              })),
            ),
          }),
          TE.map(NEA.map(({ id }) => id)),
          TE.tap(this.esIndexRepo.findAndIndexDocumentsByIds),
        );
      }),
    );
  }
}
