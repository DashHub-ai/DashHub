import { array as A, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import snakecaseKeys from 'snakecase-keys';
import { inject, injectable } from 'tsyringe';

import { tryOrThrowTE } from '@llm/commons';
import {
  createArchivedRecordMappings,
  createAutocompleteFieldAnalyzeSettings,
  createBaseAutocompleteFieldMappings,
  createBaseDatedRecordMappings,
  createElasticsearchIndexRepo,
  createIdNameObjectMapping,
  ElasticsearchRepo,
  type EsDocument,
} from '~/modules/elasticsearch';

import type { ProjectTableRowWithRelations } from '../projects.tables';

import { ProjectsRepo } from '../projects.repo';

const ProjectsAbstractEsIndexRepo = createElasticsearchIndexRepo({
  indexName: 'dashboard-projects',
  schema: {
    mappings: {
      dynamic: false,
      properties: {
        ...createBaseDatedRecordMappings(),
        ...createBaseAutocompleteFieldMappings(),
        ...createArchivedRecordMappings(),
        organization: createIdNameObjectMapping(),
        internal: {
          type: 'keyword',
        },
        description: {
          type: 'text',
          analyzer: 'folded_lowercase_analyzer',
        },
      },
    },
    settings: {
      'index.number_of_replicas': 1,
      'analysis': createAutocompleteFieldAnalyzeSettings(),
    },
  },
});

export type ProjectsEsDocument = EsDocument<ProjectTableRowWithRelations>;

@injectable()
export class ProjectsEsIndexRepo extends ProjectsAbstractEsIndexRepo<ProjectsEsDocument> {
  constructor(
    @inject(ElasticsearchRepo) elasticsearchRepo: ElasticsearchRepo,
    @inject(ProjectsRepo) private readonly projectsRepo: ProjectsRepo,
  ) {
    super(elasticsearchRepo);
  }

  protected async findEntities(ids: number[]): Promise<ProjectsEsDocument[]> {
    return pipe(
      this.projectsRepo.findWithRelationsByIds({ ids }),
      TE.map(
        A.map(entity => ({
          ...snakecaseKeys(entity, { deep: true }),
          _id: String(entity.id),
        })),
      ),
      tryOrThrowTE,
    )();
  }

  protected createAllEntitiesIdsIterator = () =>
    this.projectsRepo.createIdsIterator({
      chunkSize: 100,
    });
}
