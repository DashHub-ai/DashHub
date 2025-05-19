import { array as A, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import snakecaseKeys from 'snakecase-keys';
import { inject, injectable } from 'tsyringe';

import { Overwrite, tryOrThrowTE } from '@dashhub/commons';
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
import {
  createPermissionsRowEntryMapping,
  type EsPermissionsDocument,
} from '~/modules/permissions/record-protection';

import type { AppTableRowWithRelations } from '../apps.tables';

import { AppsRepo } from '../apps.repo';

const AppsAbstractEsIndexRepo = createElasticsearchIndexRepo({
  indexName: 'dashboard-apps',
  schema: {
    mappings: {
      dynamic: false,
      properties: {
        ...createBaseDatedRecordMappings(),
        ...createBaseAutocompleteFieldMappings(),
        ...createArchivedRecordMappings(),
        permissions: createPermissionsRowEntryMapping(),
        project: createIdNameObjectMapping(),
        organization: createIdNameObjectMapping(),
        category: createIdNameObjectMapping(),
        promotion: {
          type: 'integer',
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

export type AppsEsDocument = EsDocument<Overwrite<
  AppTableRowWithRelations,
  {
    permissions: EsPermissionsDocument;
  }
>>;

@injectable()
export class AppsEsIndexRepo extends AppsAbstractEsIndexRepo<AppsEsDocument> {
  constructor(
    @inject(ElasticsearchRepo) elasticsearchRepo: ElasticsearchRepo,
    @inject(AppsRepo) private readonly appsRepo: AppsRepo,
  ) {
    super(elasticsearchRepo);
  }

  protected async findEntities(ids: number[]): Promise<AppsEsDocument[]> {
    return pipe(
      this.appsRepo.findWithRelationsByIds({ ids }),
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
    this.appsRepo.createIdsIterator({
      chunkSize: 100,
    });
}
