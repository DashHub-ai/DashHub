import { nonEmptyArray as NEA, option as O, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';
import isValidUTF8 from 'utf-8-validate';

import type { SdkJwtTokenT } from '@llm/sdk';

import { isNil } from '@llm/commons';

import type { WithAuthFirewall } from '../auth';
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
import {
  DocAIEmbeddingGenerator,
  DocxAIEmbeddingGenerator,
  GnumericAIEmbeddingGenerator,
  PdfAIEmbeddingGenerator,
  TextAIEmbeddingGenerator,
} from './generators';
import { ProjectsEmbeddingsFirewall } from './projects-embeddings.firewall';
import { ProjectsEmbeddingsRepo } from './projects-embeddings.repo';
import { ProjectEmbeddingsInsertTableRow } from './projects-embeddings.tables';
import { formatVector } from './utils';

type EmbeddingGeneratorAttrs = {
  fileName: string;
  buffer: UploadFilePayload;
  mimeType: string;
  projectFileId: TableId;
};

const OFFICE_MIME_TYPES = new Set([
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // pptx
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
  'application/vnd.oasis.opendocument.text', // odt
  'application/vnd.oasis.opendocument.presentation', // odp
  'application/vnd.oasis.opendocument.spreadsheet', // ods
  'application/msword', // doc
]);

const GNUMERIC_MIME_TYPES = new Set([
  'application/vnd.ms-excel', // xls
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
]);

@injectable()
export class ProjectsEmbeddingsService implements WithAuthFirewall<ProjectsEmbeddingsFirewall> {
  constructor(
    @inject(ProjectsEmbeddingsRepo) private readonly repo: ProjectsEmbeddingsRepo,
    @inject(ProjectsEmbeddingsEsIndexRepo) private readonly esIndexRepo: ProjectsEmbeddingsEsIndexRepo,
    @inject(ProjectsEmbeddingsEsSearchRepo) private readonly esSearchRepo: ProjectsEmbeddingsEsSearchRepo,
    @inject(ProjectsFilesRepo) private readonly projectsFilesRepo: ProjectsFilesRepo,
    @inject(AIModelsService) private readonly aiModelsService: AIModelsService,
    @inject(TextAIEmbeddingGenerator) private readonly textAIEmbeddingGenerator: TextAIEmbeddingGenerator,
    @inject(DocxAIEmbeddingGenerator) private readonly docxAIEmbeddingGenerator: DocxAIEmbeddingGenerator,
    @inject(PdfAIEmbeddingGenerator) private readonly pdfAIEmbeddingGenerator: PdfAIEmbeddingGenerator,
    @inject(DocAIEmbeddingGenerator) private readonly docAIEmbeddingGenerator: DocAIEmbeddingGenerator,
    @inject(GnumericAIEmbeddingGenerator) private readonly gnumericAIEmbeddingGenerator: GnumericAIEmbeddingGenerator,
    @inject(ChatsRepo) private readonly chatsRepo: ChatsRepo,
    @inject(AIConnectorService) private readonly aiConnectorService: AIConnectorService,
  ) {}

  asUser = (jwt: SdkJwtTokenT) => new ProjectsEmbeddingsFirewall(jwt, this);

  get = this.esSearchRepo.get;

  search = this.esSearchRepo.search;

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
        TE.chainW(embedding => this.esSearchRepo.matchByEmbedding({
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
      fileName,
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
          if (mimeType === 'application/pdf') {
            return this.pdfAIEmbeddingGenerator.generate({
              fileName,
              aiModel,
              buffer,
            });
          }

          if (GNUMERIC_MIME_TYPES.has(mimeType)) {
            return this.gnumericAIEmbeddingGenerator.generate({
              fileName,
              aiModel,
              buffer,
            });
          }

          if (mimeType === 'application/msword') {
            return this.docAIEmbeddingGenerator.generate({
              fileName,
              aiModel,
              buffer,
            });
          }

          if (OFFICE_MIME_TYPES.has(mimeType)) {
            return this.docxAIEmbeddingGenerator.generate({
              fileName,
              aiModel,
              buffer,
            });
          }

          if (mimeType === 'text/plain'
            || (mimeType === 'application/octet-stream' && typeof buffer !== 'string' && isValidUTF8(buffer))
          ) {
            return this.textAIEmbeddingGenerator.generate({
              fileName,
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
