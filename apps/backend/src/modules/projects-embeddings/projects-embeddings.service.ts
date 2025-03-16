import { nonEmptyArray as NEA, option as O, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { delay, inject, injectable } from 'tsyringe';
import isValidUTF8 from 'utf-8-validate';

import type { SdkJwtTokenT, SdkRepeatedMessageLike, SdkSearchMessageItemT } from '@llm/sdk';

import {
  isCSVMimeType,
  isImageMimetype,
  isLegacyExcelMimetype,
  isLegacyWordMimetype,
  isNil,
  isPDFMimeType,
  isXmlOfficeMimetype,
  rejectFalsyItems,
} from '@llm/commons';

import type { WithAuthFirewall } from '../auth';
import type { TableId, TableRowWithId, TableRowWithUuid } from '../database';
import type { UploadFilePayload } from '../s3';

import { AIConnectorService } from '../ai-connector';
import { AIModelsService } from '../ai-models';
import { AppsService } from '../apps';
import { ChatsRepo } from '../chats/chats.repo';
import { OrganizationsAISettingsService } from '../organizations-ai-settings';
import { PermissionsService } from '../permissions';
import { ProjectsFilesRepo } from '../projects-files/projects-files.repo';
import { createRelevantEmbeddingsPrompt } from '../prompts';
import {
  ProjectsEmbeddingsEsIndexRepo,
  ProjectsEmbeddingsEsSearchRepo,
} from './elasticsearch';
import {
  CsvAIEmbeddingGenerator,
  DocAIEmbeddingGenerator,
  DocxAIEmbeddingGenerator,
  ImageAIEmbeddingGenerator,
  PdfAIEmbeddingGenerator,
  TextAIEmbeddingGenerator,
  XlsAIEmbeddingGenerator,
} from './generators';
import { formatVector } from './helpers';
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
    @inject(CsvAIEmbeddingGenerator) private readonly csvAIEmbeddingGenerator: CsvAIEmbeddingGenerator,
    @inject(ChatsRepo) private readonly chatsRepo: ChatsRepo,
    @inject(AIConnectorService) private readonly aiConnectorService: AIConnectorService,
    @inject(delay(() => OrganizationsAISettingsService)) private readonly organizationsAISettingsService: OrganizationsAISettingsService,
    @inject(delay(() => PermissionsService)) private readonly permissionsService: Readonly<PermissionsService>,
    @inject(delay(() => AppsService)) private readonly appsService: Readonly<AppsService>,
  ) {}

  asUser = (jwt: SdkJwtTokenT) => new ProjectsEmbeddingsFirewall(jwt, this, this.permissionsService);

  get = this.esSearchRepo.get;

  search = this.esSearchRepo.search;

  createEmbeddingsAITag = (
    {
      message,
      chat,
      history,
    }: {
      message: string;
      chat: TableRowWithUuid & {
        organization: TableRowWithId;
      };
      history: Array<SdkRepeatedMessageLike<SdkSearchMessageItemT>>;
    },
  ) => {
    const appsIds = history.flatMap(({ app }) => app ? [app.id] : []);

    return pipe(
      TE.Do,
      TE.apSW('fileEmbeddingModel', this.chatsRepo.getFileEmbeddingAIModelId({ id: chat.id })),
      TE.apSW(
        'organizationProjectId',
        this.organizationsAISettingsService.getProjectIdByOrganizationIdOrNil({
          organizationId: chat.organization.id,
        }),
      ),
      TE.apSW('apps', this.appsService.search({
        archived: false,
        ids: appsIds,
        limit: appsIds.length,
        offset: 0,
        sort: 'createdAt:desc',
      })),
      TE.chainW(({ apps, fileEmbeddingModel: { id, projectId }, organizationProjectId }) => {
        if (isNil(projectId) && !apps.items.length && isNil(organizationProjectId)) {
          return TE.of(null);
        }

        const projectsIds = rejectFalsyItems([
          projectId,
          organizationProjectId,
          ...apps.items.map(({ project }) => project.id),
        ]);

        const appsProjectIds = new Set(apps.items.map(({ project }) => project.id));

        return pipe(
          this.aiModelsService.get(id),
          TE.chainW(aiModel => this.aiConnectorService.executeEmbeddingPrompt({
            aiModel,
            input: message,
          })),
          TE.chainW(embedding => this.esSearchRepo.matchByEmbedding({
            embedding,
            projectsIds,
            chatId: chat.id,
          })),
          TE.map(searchResults => searchResults.map(result => ({
            ...result,
            isInternalKnowledge: appsProjectIds.has(result.project.id) || result.project.id === organizationProjectId,
          }))),
          TE.map(createRelevantEmbeddingsPrompt),
        );
      }),
    );
  };

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

          if (isCSVMimeType(mimeType)) {
            return this.csvAIEmbeddingGenerator.generate(attrs);
          }

          if (mimeType.startsWith('text/')
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
