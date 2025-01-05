import { array as A, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import snakecaseKeys from 'snakecase-keys';
import { inject, injectable } from 'tsyringe';

import { Overwrite, tryOrThrowTE } from '@llm/commons';
import {
  createAIGeneratedFieldMappings,
  createArchivedRecordMappings,
  createAutocompleteFieldAnalyzeSettings,
  createBaseAutocompleteFieldMappings,
  createBaseDatedRecordMappings,
  createElasticsearchIndexRepo,
  createIdNameObjectMapping,
  ElasticsearchRepo,
  EsAIGeneratedField,
  type EsDocument,
} from '~/modules/elasticsearch';
import { createPermissionsRowEntryMapping, EsPermissionsDocument } from '~/modules/permissions/record-protection';

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
        permissions: createPermissionsRowEntryMapping(),
        organization: createIdNameObjectMapping(),
        internal: {
          type: 'keyword',
        },
        summary: {
          properties: {
            content: createAIGeneratedFieldMappings(),
          },
        },
      },
    },
    settings: {
      'index.number_of_replicas': 1,
      'analysis': createAutocompleteFieldAnalyzeSettings(),
    },
  },
});

export type ProjectsEsDocument = EsDocument<Overwrite<
  ProjectTableRowWithRelations,
  {
    permissions: EsPermissionsDocument;
    summary: {
      content: EsAIGeneratedField;
    };
  }
>>;

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
        A.map(({ summary, ...entity }) => ({
          ...snakecaseKeys(entity, { deep: true }),
          _id: String(entity.id),
          summary: {
            content: {
              value: summary.content,
              generated: summary.contentGenerated,
              generated_at: summary.contentGeneratedAt,
            },
          },
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
