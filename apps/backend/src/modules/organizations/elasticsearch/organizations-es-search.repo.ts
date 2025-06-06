import esb from 'elastic-builder';
import { array as A, taskEither as TE } from 'fp-ts';
import { flow, pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import type {
  SdkSearchOrganizationItemT,
  SdkSearchOrganizationsInputT,
} from '@dashhub/sdk';

import { isNil, pluck, rejectFalsyItems } from '@dashhub/commons';
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

  get = flow(
    this.indexRepo.getDocument,
    TE.map(OrganizationsEsSearchRepo.mapOutputHit),
  );

  search = (dto: SdkSearchOrganizationsInputT) =>
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

  private static createEsRequestSearchBody = (dto: SdkSearchOrganizationsInputT) =>
    createPaginationOffsetSearchQuery(dto)
      .query(OrganizationsEsSearchRepo.createEsRequestSearchFilters(dto))
      .sorts(createScoredSortFieldQuery(dto.sort));

  private static createEsRequestSearchFilters = (
    {
      phrase,
      ids,
      archived,
    }: SdkSearchOrganizationsInputT,
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
      aiSettings: {
        chatContext: source.ai_settings?.chat_context ?? null,
        project: source.ai_settings?.project,
      },
    });
}
