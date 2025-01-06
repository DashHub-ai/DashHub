import camelcaseKeys from 'camelcase-keys';
import esb from 'elastic-builder';
import { array as A, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import type {
  SdkSearchMessageItemT,
  SdkSearchMessagesInputT,
} from '@llm/sdk';

import { pluck, rejectFalsyItems } from '@llm/commons';
import { TableUuid } from '~/modules/database';
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

  get = (id: TableUuid) =>
    pipe(
      this.indexRepo.getDocument(id),
      TE.map(MessagesEsSearchRepo.mapOutputHit),
    );

  searchByChatId = (
    chatId: TableUuid,
    dto: Omit<SdkSearchMessagesInputT, 'chatIds'> = {
      offset: 0,
      limit: 200,
      sort: 'createdAt:desc',
    },
  ) =>
    this.search({
      ...dto,
      chatIds: [chatId],
    });

  search = (dto: SdkSearchMessagesInputT) =>
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

  private static createEsRequestSearchBody = (dto: SdkSearchMessagesInputT) =>
    createPaginationOffsetSearchQuery(dto)
      .query(MessagesEsSearchRepo.createEsRequestSearchFilters(dto))
      .sorts(createScoredSortFieldQuery(dto.sort));

  private static createEsRequestSearchFilters = (
    {
      phrase,
      ids,
      chatIds,
    }: SdkSearchMessagesInputT,
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
