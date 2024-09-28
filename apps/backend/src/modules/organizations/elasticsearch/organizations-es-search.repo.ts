import esb from 'elastic-builder';
import { array as A, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/function';
import { inject, injectable } from 'tsyringe';

import type {
  SdkSearchOrganizationItemT,
  SdKSearchOrganizationsInputT,
} from '@llm/sdk';

import { isNil, pluck, rejectFalsyItems } from '@llm/commons';
import {
  createPaginationOffsetSearchQuery,
  createPhraseFieldQuery,
  createScoredSortFieldQuery,
} from '~/modules/elasticsearch';

import {
  type OrganizationsEsDocument,
  OrganizationsEsIndexRepo,
} from './organizations-es-index.repo';

@injectable()
export class OrganizationsEsSearchRepo {
  constructor(
    @inject(OrganizationsEsIndexRepo) private readonly indexRepo: OrganizationsEsIndexRepo,
  ) {}

  search = (dto: SdKSearchOrganizationsInputT) =>
    pipe(
      this.indexRepo.search(
        OrganizationsEsSearchRepo.createEsRequestSearchBody(dto).toJSON(),
      ),
      TE.map(({ hits: { total, hits } }) => ({
        items: pipe(
          hits,
          pluck('_source'),
          A.map(item => OrganizationsEsSearchRepo.mapOutputHit(item as OrganizationsEsDocument)),
        ),
        total: total.value,
      })),
    );

  private static createEsRequestSearchBody = (dto: SdKSearchOrganizationsInputT) =>
    createPaginationOffsetSearchQuery(dto)
      .query(OrganizationsEsSearchRepo.createEsRequestSearchFilters(dto))
      .sorts(createScoredSortFieldQuery(dto.sort));

  private static createEsRequestSearchFilters = (
    {
      phrase,
      ids,
      archived,
    }: SdKSearchOrganizationsInputT,
  ): esb.Query =>
    esb.boolQuery().must(
      rejectFalsyItems([
        !!ids?.length && esb.termsQuery('id', ids),
        !!phrase && createPhraseFieldQuery()(phrase),
        !isNil(archived) && esb.termQuery('archived', archived),
      ]),
    );

  private static mapOutputHit = (source: OrganizationsEsDocument): SdkSearchOrganizationItemT =>
    ({
      id: source.id,
      name: source.name,
      createdAt: source.created_at,
      updatedAt: source.updated_at,
      archived: source.archived,
      maxNumberOfUsers: source.max_number_of_users ?? 0,
    });
}
