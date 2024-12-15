import { array as A, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import snakecaseKeys from 'snakecase-keys';
import { inject, injectable } from 'tsyringe';

import type { TableId } from '~/modules/database';

import { tryOrThrowTE } from '@llm/commons';
import {
  createAutocompleteFieldAnalyzeSettings,
  createBaseAutocompleteFieldMappings,
  createBaseDatedRecordMappings,
  createElasticsearchIndexRepo,
  createIdNameObjectMapping,
  ElasticsearchRepo,
  type EsDocument,
} from '~/modules/elasticsearch';

import type { ProjectFileTableRowWithRelations } from '../projects-files.tables';

import { ProjectsFilesRepo } from '../projects-files.repo';

const ProjectsFilesAbstractEsIndexRepo = createElasticsearchIndexRepo({
  indexName: 'dashboard-projects-files',
  schema: {
    mappings: {
      dynamic: false,
      properties: {
        ...createBaseDatedRecordMappings(),
        ...createBaseAutocompleteFieldMappings(),
        project: createIdNameObjectMapping(),
      },
    },
    settings: {
      'index.number_of_replicas': 1,
      'analysis': createAutocompleteFieldAnalyzeSettings(),
    },
  },
});

export type ProjectFileEsDocument = Omit<EsDocument<ProjectFileTableRowWithRelations>, 's_3_key'> & {
  s3_key: string;
};

@injectable()
export class ProjectsFilesEsIndexRepo extends ProjectsFilesAbstractEsIndexRepo<ProjectFileEsDocument> {
  constructor(
    @inject(ElasticsearchRepo) elasticsearchRepo: ElasticsearchRepo,
    @inject(ProjectsFilesRepo) private readonly projectsFilesRepo: ProjectsFilesRepo,
  ) {
    super(elasticsearchRepo);
  }

  reindexAllProjectFiles = (projectId: TableId) => pipe(
    this.projectsFilesRepo.createIdsIterator({
      chunkSize: 100,
      projectId,
    }),
    this.findAndIndexDocumentsByStream,
  )();

  protected async findEntities(ids: number[]): Promise<ProjectFileEsDocument[]> {
    return pipe(
      this.projectsFilesRepo.findWithRelationsByIds({ ids }),
      TE.map(
        A.map((entity): ProjectFileEsDocument => ({
          ...snakecaseKeys(entity, { deep: true }),
          _id: String(entity.id),
        })),
      ),
      tryOrThrowTE,
    )();
  }

  protected createAllEntitiesIdsIterator = () =>
    this.projectsFilesRepo.createIdsIterator({
      chunkSize: 100,
    });
}
