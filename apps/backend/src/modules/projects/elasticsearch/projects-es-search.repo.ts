import esb from 'elastic-builder';
import { array as A, taskEither as TE } from 'fp-ts';
import { flow, pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import type {
  SdkSearchProjectItemT,
  SdkSearchProjectsInputT,
} from '@dashhub/sdk';

import { isNil, pluck, rejectFalsyItems } from '@dashhub/commons';
import {
  createPaginationOffsetSearchQuery,
  createPhraseFieldQuery,
  createScoredSortFieldQuery,
} from '~/modules/elasticsearch';
import { createEsPermissionsFilters, mapRawEsDocToSdkPermissions, WithPermissionsInternalFilters } from '~/modules/permissions/record-protection';

import {
  type ProjectsEsDocument,
  ProjectsEsIndexRepo,
} from './projects-es-index.repo';

export type EsProjectsInternalFilters =
  & WithPermissionsInternalFilters<SdkSearchProjectsInputT>
  & {
    excludeInternal?: boolean;
  };

@injectable()
export class ProjectsEsSearchRepo {
  constructor(
    @inject(ProjectsEsIndexRepo) private readonly indexRepo: ProjectsEsIndexRepo,
  ) {}

  get = flow(
    this.indexRepo.getDocument,
    TE.map(ProjectsEsSearchRepo.mapOutputHit),
  );

  search = (dto: EsProjectsInternalFilters) =>
    pipe(
      this.indexRepo.search(
        ProjectsEsSearchRepo.createEsRequestSearchBody(dto).toJSON(),
      ),
      TE.map(({ hits: { total, hits } }) => ({
        items: pipe(
          hits,
          pluck('_source'),
          A.map(item => ProjectsEsSearchRepo.mapOutputHit(item as ProjectsEsDocument)),
        ),
        total: total.value,
      })),
    );

  private static createEsRequestSearchBody = (dto: SdkSearchProjectsInputT) =>
    createPaginationOffsetSearchQuery(dto)
      .query(ProjectsEsSearchRepo.createEsRequestSearchFilters(dto))
      .sorts(createScoredSortFieldQuery(dto.sort));

  private static createEsRequestSearchFilters = (
    {
      excludeInternal = true,
      phrase,
      ids,
      organizationIds,
      creatorIds,
      archived,
      satisfyPermissions,
    }: EsProjectsInternalFilters,
  ): esb.Query =>
    esb.boolQuery().must(
      rejectFalsyItems([
        !!satisfyPermissions && createEsPermissionsFilters(satisfyPermissions),
        !!ids?.length && esb.termsQuery('id', ids),
        !!organizationIds?.length && esb.termsQuery('organization.id', organizationIds),
        !!creatorIds?.length && esb.termsQuery('creator.id', creatorIds),
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
        excludeInternal && esb.termQuery('internal', false),
      ]),
    );

  private static mapOutputHit = ({ summary, ...source }: ProjectsEsDocument): SdkSearchProjectItemT =>
    ({
      id: source.id,
      name: source.name,
      createdAt: source.created_at,
      updatedAt: source.updated_at,
      archived: source.archived,
      creator: source.creator,
      organization: source.organization,
      permissions: mapRawEsDocToSdkPermissions(source.permissions),
      summary: {
        content: {
          generated: summary.content.generated,
          value: summary.content.value,
          generatedAt: summary.content.generated_at,
        },
      },
    });
}
