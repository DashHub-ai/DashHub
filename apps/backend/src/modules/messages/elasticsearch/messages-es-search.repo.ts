import camelcaseKeys from 'camelcase-keys';
import esb from 'elastic-builder';
import { array as A, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import type {
  SdkSearchMessageItemT,
  SdkSearchMessagesInputT,
} from '@llm/sdk';
import type { TableUuid } from '~/modules/database';

import { pluck, rejectFalsyItems } from '@llm/commons';
import {
  createPaginationOffsetSearchQuery,
  createScoredSortFieldQuery,
} from '~/modules/elasticsearch';
import { createEsPermissionsFilters, type WithPermissionsInternalFilters } from '~/modules/permissions';

import {
  type MessagesEsDocument,
  MessagesEsIndexRepo,
} from './messages-es-index.repo';

type EsMessagesInternalFilters = WithPermissionsInternalFilters<SdkSearchMessagesInputT>;

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

  search = (dto: EsMessagesInternalFilters) =>
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

  private static createEsRequestSearchBody = (dto: EsMessagesInternalFilters) =>
    createPaginationOffsetSearchQuery(dto)
      .query(MessagesEsSearchRepo.createEsRequestSearchFilters(dto))
      .sorts(createScoredSortFieldQuery(dto.sort));

  private static createEsRequestSearchFilters = (
    {
      phrase,
      ids,
      chatIds,
      satisfyPermissions,
    }: EsMessagesInternalFilters,
  ): esb.Query =>
    esb.boolQuery().must(
      rejectFalsyItems([
        !!satisfyPermissions && createEsPermissionsFilters(satisfyPermissions, 'chat.permissions'),
        !!ids?.length && esb.termsQuery('id', ids),
        !!chatIds?.length && esb.termsQuery('chat.id', chatIds),
        !!phrase && esb.matchPhrasePrefixQuery('content', phrase).boost(1.5),
      ]),
    );

  private static mapOutputHit = (source: MessagesEsDocument): SdkSearchMessageItemT => ({
    id: source.id,
    content: source.content,
    role: source.role,
    createdAt: source.created_at,
    updatedAt: source.updated_at,
    files: camelcaseKeys(source.files, { deep: true }),
    corrupted: source.corrupted,
    webSearch: {
      enabled: source.web_search,
      results: camelcaseKeys(source.metadata.web_search_results || [] as any, { deep: true }),
    },
    creator: source.creator && {
      id: source.creator.id,
      email: source.creator.email,
      name: source.creator.name,
    },
    chat: {
      id: source.chat.id,
      creator: source.chat.creator,
    },
    aiModel: source.ai_model && {
      id: source.ai_model.id,
      name: source.ai_model.name,
    },
    app: source.app && {
      id: source.app.id,
      name: source.app.name,
    },
    repliedMessage: source.replied_message && {
      id: source.replied_message.id,
      content: source.replied_message.content,
      role: source.replied_message.role,
      creator: source.replied_message.creator && {
        id: source.replied_message.creator.id,
        email: source.replied_message.creator.email,
        name: source.replied_message.creator.name,
      },
    },
  });
}
