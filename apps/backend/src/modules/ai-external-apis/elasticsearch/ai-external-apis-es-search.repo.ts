import camelcaseKeys from 'camelcase-keys';
import esb from 'elastic-builder';
import { array as A, taskEither as TE } from 'fp-ts';
import { flow, pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import type {
  SdkSearchAIExternalAPIItemT,
  SdkSearchAIExternalAPIsInputT,
} from '@llm/sdk';

import { isNil, pluck, rejectFalsyItems } from '@llm/commons';
import {
  createPaginationOffsetSearchQuery,
  createPhraseFieldQuery,
  createScoredSortFieldQuery,
} from '~/modules/elasticsearch';
import {
  createEsPermissionsFilters,
  mapRawEsDocToSdkPermissions,
  WithPermissionsInternalFilters,
} from '~/modules/permissions';

import {
  type AIExternalAPIsEsDocument,
  AIExternalAPIsEsIndexRepo,
} from './ai-external-apis-es-index.repo';

type EsAIExternalAPIsInternalFilters = WithPermissionsInternalFilters<SdkSearchAIExternalAPIsInputT> & {
  internal?: boolean;
};

@injectable()
export class AIExternalAPIsEsSearchRepo {
  constructor(
    @inject(AIExternalAPIsEsIndexRepo) private readonly indexRepo: AIExternalAPIsEsIndexRepo,
  ) {}

  get = flow(
    this.indexRepo.getDocument,
    TE.map(AIExternalAPIsEsSearchRepo.mapOutputHit),
  );

  search = (dto: EsAIExternalAPIsInternalFilters) =>
    pipe(
      this.indexRepo.search(
        AIExternalAPIsEsSearchRepo.createEsRequestSearchBody(dto).toJSON(),
      ),
      TE.map(({ hits: { total, hits } }) => ({
        items: pipe(
          hits,
          pluck('_source'),
          A.map(item => AIExternalAPIsEsSearchRepo.mapOutputHit(item as AIExternalAPIsEsDocument)),
        ),
        total: total.value,
      })),
    );

  private static createEsRequestSearchBody = (dto: EsAIExternalAPIsInternalFilters) =>
    createPaginationOffsetSearchQuery(dto)
      .query(AIExternalAPIsEsSearchRepo.createEsRequestSearchFilters(dto))
      .sorts(createScoredSortFieldQuery(dto.sort));

  private static createEsRequestSearchFilters = (
    {
      phrase,
      ids,
      organizationIds,
      archived,
      satisfyPermissions,
      internal,
    }: EsAIExternalAPIsInternalFilters,
  ): esb.Query =>
    esb.boolQuery().must(
      rejectFalsyItems([
        esb.termsQuery('internal', internal ?? false),
        !!satisfyPermissions && createEsPermissionsFilters(satisfyPermissions),
        !!ids?.length && esb.termsQuery('id', ids),
        !!organizationIds?.length && esb.termsQuery('organization.id', organizationIds),
        !!phrase && (
          esb
            .boolQuery()
            .should([
              createPhraseFieldQuery()(phrase).boost(3),
              esb.matchPhrasePrefixQuery('description', phrase).boost(1.5),
            ])
            .minimumShouldMatch(1)
        ),
        !isNil(archived) && esb.termQuery('archived', archived),
      ]),
    );

  private static mapOutputHit = (source: AIExternalAPIsEsDocument): SdkSearchAIExternalAPIItemT =>
    ({
      id: source.id,
      name: source.name,
      createdAt: source.created_at,
      updatedAt: source.updated_at,
      archived: source.archived,
      organization: source.organization,
      description: source.description,
      logo: source.logo && camelcaseKeys(source.logo, { deep: true }),
      permissions: mapRawEsDocToSdkPermissions(source.permissions),
      schema: camelcaseKeys(source.schema, { deep: true }),
    });
}
