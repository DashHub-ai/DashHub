import { nonEmptyArray as NEA, option as O, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';
import isValidUTF8 from 'utf-8-validate';

import { isNil } from '@llm/commons';

import type { TableId, TableRowWithUuid } from '../database';
import type { UploadFilePayload } from '../s3';

import { AIConnectorService } from '../ai-connector';
import { AIModelsService } from '../ai-models';
import { ChatsRepo } from '../chats/chats.repo';
import { ProjectsFilesRepo } from '../projects-files/projects-files.repo';
import {
  type EsMatchingProjectEmbedding,
  ProjectsEmbeddingsEsIndexRepo,
  ProjectsEmbeddingsEsSearchRepo,
} from './elasticsearch';
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
  constructor(
    @inject(ProjectsEmbeddingsRepo) private readonly repo: ProjectsEmbeddingsRepo,
    @inject(ProjectsEmbeddingsEsIndexRepo) private readonly esIndexRepo: ProjectsEmbeddingsEsIndexRepo,
    @inject(ProjectsEmbeddingsEsSearchRepo) private readonly esSearchRepo: ProjectsEmbeddingsEsSearchRepo,
    @inject(ProjectsFilesRepo) private readonly projectsFilesRepo: ProjectsFilesRepo,
    @inject(AIModelsService) private readonly aiModelsService: AIModelsService,
    @inject(TextAIEmbeddingGenerator) private readonly textAIEmbeddingGenerator: TextAIEmbeddingGenerator,
    @inject(ChatsRepo) private readonly chatsRepo: ChatsRepo,
    @inject(AIConnectorService) private readonly aiConnectorService: AIConnectorService,
  ) {}

  wrapWithEmbeddingContextPrompt = (
    {
      message,
      chat,
    }: {
      message: string;
      chat: TableRowWithUuid;
    },
  ) => pipe(
    this.chatsRepo.getFileEmbeddingAIModelId({ id: chat.id }),
    TE.chainW(({ id, projectId }) => {
      if (isNil(projectId)) {
        return TE.of(message);
      }

      return pipe(
        this.aiModelsService.get(id),
        TE.chainW(aiModel => this.aiConnectorService.executeEmbeddingPrompt({
          aiModel,
          input: message,
        })),
        TE.chainW(embedding => this.esSearchRepo.searchByEmbedding({
          embedding,
          projectId,
        })),
        TE.map(searchResults => createRelevantEmbeddingsPrompt(message, searchResults)),
      );
    }),
  );

  deleteProjectFileEmbeddings = (projectFileId: TableId) => pipe(
    this.repo.deleteByProjectFileId({ projectFileId }),
    TE.chainW(() =>
      this.esIndexRepo.deleteByProjectFileId(projectFileId),
    ),
  );

  generateFileEmbeddings(
    {
      buffer,
      mimeType,
      projectFileId,
    }: EmbeddingGeneratorAttrs,
  ) {
    return pipe(
      TE.Do,
      TE.bind('aiModel', () => pipe(
        this.projectsFilesRepo.getFileEmbeddingAIModelId({ id: projectFileId }),
        TE.chainW(aiModel => this.aiModelsService.get(aiModel.id)),
      )),
      TE.bindW('maybeEmbeddings', ({ aiModel }) => {
        const task = (() => {
          if (mimeType === 'text/plain'
            || (mimeType === 'application/octet-stream' && typeof buffer !== 'string' && isValidUTF8(buffer))
          ) {
            return this.textAIEmbeddingGenerator.generate({
              aiModel,
              buffer,
            });
          }

          return TE.of([]);
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

function createRelevantEmbeddingsPrompt(message: string, embeddings: EsMatchingProjectEmbedding[]) {
  const fragments = embeddings
    .map(({ text, id }) => `#embedding:${id}\n${text}`)
    .join('\n--\n');

  return [
    message,
    '\n\n\n--\n',
    'Context (based on project files):',
    fragments,
    '\n--\n',
    'Please provide a response to the user\'s question utilizing the above context where applicable.'
    + ' When incorporating information from the context:'
    + ' - Each reference to different context parts must be prefixed with its #embedding:<id>'
    + ' - For direct quotes use: #embedding:<id> "quoted text"'
    + ' - For paraphrasing use: #embedding:<id> explains that... or According to #embedding:<id>...'
    + ' - When combining information from multiple sources, each source must be properly attributed'
    + ' - Make sure to maintain proper #embedding:<id> prefixes even when referencing multiple sources in the same sentence'
    + ' If the context is not relevant, provide a general response.'
    + ' Note: The context is derived from the project files.',
  ].join('\n');
}
