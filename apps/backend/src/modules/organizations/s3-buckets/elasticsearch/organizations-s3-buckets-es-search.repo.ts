import camelcaseKeys from 'camelcase-keys';
import esb from 'elastic-builder';
import { array as A, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import type {
  SdkSearchS3BucketItemT,
  SdKSearchS3BucketsInputT,
} from '@llm/sdk';

import { isNil, pluck, rejectFalsyItems } from '@llm/commons';
import {
  createPaginationOffsetSearchQuery,
  createPhraseFieldQuery,
  createScoredSortFieldQuery,
} from '~/modules/elasticsearch';

import {
  type OrganizationsS3BucketsEsDocument,
  OrganizationsS3BucketsEsIndexRepo,
} from './organizations-s3-buckets-es-index.repo';

@injectable()
export class OrganizationsS3BucketsEsSearchRepo {
  constructor(
    @inject(OrganizationsS3BucketsEsIndexRepo) private readonly indexRepo: OrganizationsS3BucketsEsIndexRepo,
  ) {}

  search = (dto: SdKSearchS3BucketsInputT) =>
    pipe(
      this.indexRepo.search(
        OrganizationsS3BucketsEsSearchRepo.createEsRequestSearchBody(dto).toJSON(),
      ),
      TE.map(({ hits: { total, hits } }) => ({
        items: pipe(
          hits,
          pluck('_source'),
          A.map(item => OrganizationsS3BucketsEsSearchRepo.mapOutputHit(item as OrganizationsS3BucketsEsDocument)),
        ),
        total: total.value,
      })),
    );

  private static createEsRequestSearchBody = (dto: SdKSearchS3BucketsInputT) =>
    createPaginationOffsetSearchQuery(dto)
      .query(OrganizationsS3BucketsEsSearchRepo.createEsRequestSearchFilters(dto))
      .sorts(createScoredSortFieldQuery(dto.sort));

  private static createEsRequestSearchFilters = (
    {
      phrase,
      ids,
      organizationIds,
      archived,
    }: SdKSearchS3BucketsInputT,
  ): esb.Query =>
    esb.boolQuery().must(
      rejectFalsyItems([
        !!ids?.length && esb.termsQuery('id', ids),
        !!organizationIds?.length && esb.termsQuery('organization.id', organizationIds),
        !!phrase && createPhraseFieldQuery()(phrase),
        !isNil(archived) && esb.termQuery('archived', archived),
      ]),
    );

  private static mapOutputHit = (source: OrganizationsS3BucketsEsDocument): SdkSearchS3BucketItemT =>
    ({
      ...camelcaseKeys(source.bucket, { deep: true }),
      default: source.default,
      organization: source.organization,
    });
}
