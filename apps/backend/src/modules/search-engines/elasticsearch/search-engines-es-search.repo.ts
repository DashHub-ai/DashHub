import camelcaseKeys from 'camelcase-keys';
import esb from 'elastic-builder';
import { array as A, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import type {
  SdkSearchSearchEngineItemT,
  SdkSearchSearchEnginesInputT,
} from '@llm/sdk';
import type { TableId } from '~/modules/database';

import { isNil, pluck, rejectFalsyItems } from '@llm/commons';
import {
  createPaginationOffsetSearchQuery,
  createPhraseFieldQuery,
  createScoredSortFieldQuery,
  tryGetFirstPaginationHitOrNotExists,
} from '~/modules/elasticsearch';

import {
  type SearchEnginesEsDocument,
  SearchEnginesEsIndexRepo,
} from './search-engines-es-index.repo';

@injectable()
export class SearchEnginesEsSearchRepo {
  constructor(
    @inject(SearchEnginesEsIndexRepo) private readonly indexRepo: SearchEnginesEsIndexRepo,
  ) {}

  get = (id: TableId) =>
    pipe(
      this.indexRepo.getDocument(id),
      TE.map(SearchEnginesEsSearchRepo.mapOutputHit),
    );

  getDefault = (organizationId: TableId) => pipe(
    this.search({
      organizationIds: [organizationId],
      archived: false,
      default: true,
      offset: 0,
      limit: 1,
      sort: 'id:desc',
    }),
    tryGetFirstPaginationHitOrNotExists,
  );

  search = (dto: SdkSearchSearchEnginesInputT) =>
    pipe(
      this.indexRepo.search(
        SearchEnginesEsSearchRepo.createEsRequestSearchBody(dto).toJSON(),
      ),
      TE.map(({ hits: { total, hits } }) => ({
        items: pipe(
          hits,
          pluck('_source'),
          A.map(item => SearchEnginesEsSearchRepo.mapOutputHit(item as SearchEnginesEsDocument)),
        ),
        total: total.value,
      })),
    );

  private static createEsRequestSearchBody = (dto: SdkSearchSearchEnginesInputT) =>
    createPaginationOffsetSearchQuery(dto)
      .query(SearchEnginesEsSearchRepo.createEsRequestSearchFilters(dto))
      .sorts(createScoredSortFieldQuery(dto.sort));

  private static createEsRequestSearchFilters = (
    {
      default: isDefault,
      phrase,
      ids,
      organizationIds,
      archived,
    }: SdkSearchSearchEnginesInputT,
  ): esb.Query =>
    esb.boolQuery().must(
      rejectFalsyItems([
        !!ids?.length && esb.termsQuery('id', ids),
        !!organizationIds?.length && esb.termsQuery('organization.id', organizationIds),
        !isNil(isDefault) && esb.termQuery('default', isDefault),
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

  private static mapOutputHit = (source: SearchEnginesEsDocument): SdkSearchSearchEngineItemT =>
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
      default: source.default,
    });
}
