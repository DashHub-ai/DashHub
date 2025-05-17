import camelcaseKeys from 'camelcase-keys';
import esb from 'elastic-builder';
import { array as A, taskEither as TE } from 'fp-ts';
import { flow, pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import type {
  SdkSearchPinnedMessageItemT,
  SdkSearchPinnedMessagesInputT,
} from '@dashhub/sdk';

import { pluck, rejectFalsyItems } from '@dashhub/commons';
import {
  createPaginationOffsetSearchQuery,
  createPhraseFieldQuery,
  createScoredSortFieldQuery,
} from '~/modules/elasticsearch';

import {
  type PinnedMessagesEsDocument,
  PinnedMessagesEsIndexRepo,
} from './pinned-messages-es-index.repo';

@injectable()
export class PinnedMessagesEsSearchRepo {
  constructor(
    @inject(PinnedMessagesEsIndexRepo) private readonly indexRepo: PinnedMessagesEsIndexRepo,
  ) {}

  get = flow(
    this.indexRepo.getDocument,
    TE.map(PinnedMessagesEsSearchRepo.mapOutputHit),
  );

  search = (dto: SdkSearchPinnedMessagesInputT) =>
    pipe(
      this.indexRepo.search(
        PinnedMessagesEsSearchRepo.createEsRequestSearchBody(dto).toJSON(),
      ),
      TE.map(({ hits: { total, hits } }) => ({
        items: pipe(
          hits,
          pluck('_source'),
          A.map(item => PinnedMessagesEsSearchRepo.mapOutputHit(item as PinnedMessagesEsDocument)),
        ),
        total: total.value,
      })),
    );

  private static createEsRequestSearchBody = (dto: SdkSearchPinnedMessagesInputT) =>
    createPaginationOffsetSearchQuery(dto)
      .query(PinnedMessagesEsSearchRepo.createEsRequestSearchFilters(dto))
      .sorts(createScoredSortFieldQuery(dto.sort));

  private static createEsRequestSearchFilters = (
    {
      phrase,
      ids,
      creatorsIds,
    }: SdkSearchPinnedMessagesInputT,
  ): esb.Query =>
    esb.boolQuery().must(
      rejectFalsyItems([
        !!ids?.length && esb.termsQuery('id', ids),
        !!creatorsIds?.length && esb.termsQuery('creator.id', creatorsIds),
        !!phrase && createPhraseFieldQuery('message.content')(phrase).boost(3),
      ]),
    );

  private static mapOutputHit = ({ message, ...dto }: PinnedMessagesEsDocument): SdkSearchPinnedMessageItemT => {
    const casted = camelcaseKeys(dto, { deep: true });

    return {
      ...casted,
      id: +casted.id,
      message: {
        ...camelcaseKeys(message, { deep: true }),
        asyncFunctionsResults: (message.metadata.async_functions_results as any || []).map(
          (result: any) => camelcaseKeys(result, { deep: false }),
        ),
        webSearch: {
          enabled: message.web_search,
          results: camelcaseKeys(message.metadata.web_search_results || [] as any, { deep: true }),
        },
      },
    };
  };
}
