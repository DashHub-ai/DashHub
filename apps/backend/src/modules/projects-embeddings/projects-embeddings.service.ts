import { nonEmptyArray as NEA, option as O, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { delay, inject, injectable } from 'tsyringe';
import isValidUTF8 from 'utf-8-validate';

import type { SdkJwtTokenT } from '@llm/sdk';

import {
  isImageMimetype,
  isLegacyExcelMimetype,
  isLegacyWordMimetype,
  isNil,
  isPDFMimeType,
  isXmlOfficeMimetype,
} from '@llm/commons';

import type { WithAuthFirewall } from '../auth';
import type { TableId, TableRowWithUuid } from '../database';
import type { UploadFilePayload } from '../s3';

import { AIConnectorService } from '../ai-connector';
import { AIModelsService } from '../ai-models';
import { ChatsRepo } from '../chats/chats.repo';
import { PermissionsService } from '../permissions';
import { ProjectsFilesRepo } from '../projects-files/projects-files.repo';
import {
  ProjectsEmbeddingsEsIndexRepo,
  ProjectsEmbeddingsEsSearchRepo,
} from './elasticsearch';
import {
  DocAIEmbeddingGenerator,
  DocxAIEmbeddingGenerator,
  ImageAIEmbeddingGenerator,
  PdfAIEmbeddingGenerator,
  TextAIEmbeddingGenerator,
  XlsAIEmbeddingGenerator,
} from './generators';
import { createRelevantEmbeddingsPrompt, formatVector } from './helpers';
import { ProjectsEmbeddingsFirewall } from './projects-embeddings.firewall';
import { ProjectsEmbeddingsRepo } from './projects-embeddings.repo';
import { ProjectEmbeddingsInsertTableRow } from './projects-embeddings.tables';

type EmbeddingGeneratorAttrs = {
  fileUrl: string;
  fileName: string;
  buffer: UploadFilePayload;
  mimeType: string;
  projectFileId: TableId;
};

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
    @inject(XlsAIEmbeddingGenerator) private readonly xlsAIEmbeddingGenerator: XlsAIEmbeddingGenerator,
    @inject(ImageAIEmbeddingGenerator) private readonly imageAIEmbeddingGenerator: ImageAIEmbeddingGenerator,
    @inject(ChatsRepo) private readonly chatsRepo: ChatsRepo,
    @inject(AIConnectorService) private readonly aiConnectorService: AIConnectorService,
    @inject(delay(() => PermissionsService)) private readonly permissionsService: Readonly<PermissionsService>,
  ) {}

  asUser = (jwt: SdkJwtTokenT) => new ProjectsEmbeddingsFirewall(jwt, this, this.permissionsService);

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
          chatId: chat.id,
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
      fileUrl,
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
        const attrs = {
          fileName,
          fileUrl,
          aiModel,
          buffer,
        };

        const task = (() => {
          if (isImageMimetype(mimeType)) {
            return this.imageAIEmbeddingGenerator.generate(attrs);
          }

          if (isPDFMimeType(mimeType)) {
            return this.pdfAIEmbeddingGenerator.generate(attrs);
          }

          if (isLegacyExcelMimetype(mimeType)) {
            return this.xlsAIEmbeddingGenerator.generate(attrs);
          }

          if (isLegacyWordMimetype(mimeType)) {
            return this.docAIEmbeddingGenerator.generate(attrs);
          }

          if (isXmlOfficeMimetype(mimeType)) {
            return this.docxAIEmbeddingGenerator.generate(attrs);
          }

          if (mimeType === 'text/plain'
            || (mimeType === 'application/octet-stream' && typeof buffer !== 'string' && isValidUTF8(buffer))
          ) {
            return this.textAIEmbeddingGenerator.generate(attrs);
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
