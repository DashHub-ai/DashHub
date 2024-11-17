import camelcaseKeys from 'camelcase-keys';
import esb from 'elastic-builder';
import { array as A, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import type {
  SdkSearchMessageItemT,
  SdKSearchMessagesInputT,
} from '@llm/sdk';

import { pluck, rejectFalsyItems } from '@llm/commons';
import {
  createPaginationOffsetSearchQuery,
  createScoredSortFieldQuery,
} from '~/modules/elasticsearch';

import {
  type MessagesEsDocument,
  MessagesEsIndexRepo,
} from './messages-es-index.repo';

@injectable()
export class MessagesEsSearchRepo {
  constructor(
    @inject(MessagesEsIndexRepo) private readonly indexRepo: MessagesEsIndexRepo,
  ) {}

  search = (dto: SdKSearchMessagesInputT) =>
    pipe(
      this.indexRepo.search(
        MessagesEsSearchRepo.createEsRequestSearchBody(dto).toJSON(),
      ),
      TE.map(({ hits: { total, hits } }) => ({
        items: pipe(
          hits,
          pluck('_source'),
          A.map(item => MessagesEsSearchRepo.mapOutputHit(item as MessagesEsDocument)),
        ),
        total: total.value,
      })),
    );

  private static createEsRequestSearchBody = (dto: SdKSearchMessagesInputT) =>
    createPaginationOffsetSearchQuery(dto)
      .query(MessagesEsSearchRepo.createEsRequestSearchFilters(dto))
      .sorts(createScoredSortFieldQuery(dto.sort));

  private static createEsRequestSearchFilters = (
    {
      phrase,
      ids,
      chatIds,
    }: SdKSearchMessagesInputT,
  ): esb.Query =>
    esb.boolQuery().must(
      rejectFalsyItems([
        !!ids?.length && esb.termsQuery('id', ids),
        !!chatIds?.length && esb.termsQuery('chat.id', chatIds),
        !!phrase && esb.matchPhrasePrefixQuery('content', phrase).boost(1.5),
      ]),
    );

  private static mapOutputHit = (source: MessagesEsDocument): SdkSearchMessageItemT =>
    camelcaseKeys(source, { deep: true });
}
