import camelcaseKeys from 'camelcase-keys';
import esb from 'elastic-builder';
import { array as A, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import type {
  SdkSearchAIModelItemT,
  SdKSearchAIModelsInputT,
} from '@llm/sdk';

import { isNil, pluck, rejectFalsyItems } from '@llm/commons';
import {
  createPaginationOffsetSearchQuery,
  createPhraseFieldQuery,
  createScoredSortFieldQuery,
} from '~/modules/elasticsearch';

import {
  type AIModelsEsDocument,
  AIModelsEsIndexRepo,
} from './ai-models-es-index.repo';

@injectable()
export class AIModelsEsSearchRepo {
  constructor(
    @inject(AIModelsEsIndexRepo) private readonly indexRepo: AIModelsEsIndexRepo,
  ) {}

  search = (dto: SdKSearchAIModelsInputT) =>
    pipe(
      this.indexRepo.search(
        AIModelsEsSearchRepo.createEsRequestSearchBody(dto).toJSON(),
      ),
      TE.map(({ hits: { total, hits } }) => ({
        items: pipe(
          hits,
          pluck('_source'),
          A.map(item => AIModelsEsSearchRepo.mapOutputHit(item as AIModelsEsDocument)),
        ),
        total: total.value,
      })),
    );

  private static createEsRequestSearchBody = (dto: SdKSearchAIModelsInputT) =>
    createPaginationOffsetSearchQuery(dto)
      .query(AIModelsEsSearchRepo.createEsRequestSearchFilters(dto))
      .sorts(createScoredSortFieldQuery(dto.sort));

  private static createEsRequestSearchFilters = (
    {
      phrase,
      ids,
      organizationIds,
      archived,
    }: SdKSearchAIModelsInputT,
  ): esb.Query =>
    esb.boolQuery().must(
      rejectFalsyItems([
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

  private static mapOutputHit = (source: AIModelsEsDocument): SdkSearchAIModelItemT =>
    ({
      id: source.id,
      name: source.name,
      description: source.description,
      createdAt: source.created_at,
      updatedAt: source.updated_at,
      archived: source.archived,
      organization: source.organization,
      credentials: camelcaseKeys(source.credentials),
      provider: source.provider,
    });
}